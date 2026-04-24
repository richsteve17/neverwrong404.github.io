// Main controller
(() => {
  const $ = (id) => document.getElementById(id);
  const padEl = $('pad');
  const tabEl = $('tab');
  const songSelect = $('songSelect');

  let currentSong = null;
  let expanded = null;

  // ---------- Pad UI ----------
  const padCells = {}; // padNum -> element
  function buildPad() {
    padEl.innerHTML = '';
    PAD_DEF.forEach((p) => {
      const c = document.createElement('button');
      c.className = `cell ${p.cls}`;
      c.dataset.pad = p.num;
      c.dataset.voice = p.voice;
      c.innerHTML = `<span class="num">${p.num}</span><span class="lbl">${p.label}</span>${p.sub ? `<span class="sub">${p.sub}</span>` : ''}`;
      c.addEventListener('pointerdown', (e) => { e.preventDefault(); hitPad(p.num); });
      padEl.appendChild(c);
      padCells[p.num] = c;
    });
  }

  function flashPad(padNum, ms = 110) {
    const el = padCells[padNum];
    if (!el) return;
    el.classList.add('hit');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('hit'), ms);
  }

  function cuePads(padNums) {
    Object.values(padCells).forEach((el) => el.classList.remove('cue'));
    padNums.forEach((n) => padCells[n] && padCells[n].classList.add('cue'));
  }

  function hitPad(padNum) {
    Drums.resume();
    const voice = PAD_VOICE[padNum];
    Drums.play(voice);
    flashPad(padNum);
  }

  // ---------- Song select ----------
  function buildSelect() {
    SONGS.forEach((s) => {
      const opt = document.createElement('option');
      opt.value = s.id;
      opt.textContent = `${s.id} · ${s.title} — ${s.artist}`;
      songSelect.appendChild(opt);
    });
    songSelect.addEventListener('change', () => loadSong(songSelect.value));
  }

  function loadSong(id) {
    const s = SONGS.find((x) => x.id === id);
    if (!s) return;
    currentSong = s;
    expanded = expandPattern(s);
    $('songTitle').textContent = `${s.id} · ${s.title}`;
    $('songArtist').textContent = s.artist;
    $('kitInfo').textContent = `Suggested kit: ${s.kit}`;
    $('songNotes').textContent = s.notes || '';
    const cust = $('customList');
    cust.innerHTML = '';
    s.customs.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      cust.appendChild(li);
    });
    $('bpm').value = s.bpm;
    buildTab();
    stop();
  }

  // ---------- Tab (vertical scrolling) ----------
  const tabRows = [];
  function buildTab() {
    tabEl.innerHTML = '';
    tabRows.length = 0;
    const beatsPerBar = 4;
    const stepsPerBeat = expanded.steps / beatsPerBar; // usually 4
    expanded.rows.forEach((hits, i) => {
      const beat = Math.floor(i / stepsPerBeat) + 1;
      const sub = (i % stepsPerBeat); // 0=on beat, 1=e, 2=&, 3=a (for 16ths)
      const subLabel = stepsPerBeat === 4 ? ['', 'e', '&', 'a'][sub] : (sub === 0 ? '' : '&');
      const li = document.createElement('li');
      if (i % stepsPerBeat === 0) li.classList.add('beat1');
      const stepLabel = sub === 0 ? `${beat}` : `${beat}${subLabel}`;
      const chips = hits.map((h) => {
        return `<span class="chip ${VOICE_CLASS[h.voice]}">${h.pad}·${h.voice.toUpperCase()}</span>`;
      }).join('');
      li.innerHTML = `<span class="step">${stepLabel}</span><span class="bar">bar 1</span><span class="hits">${chips || '·'}</span>`;
      tabEl.appendChild(li);
      tabRows.push(li);
    });
  }

  // ---------- Scheduler (look-ahead) ----------
  let isPlaying = false;
  let scheduleTimer = null;
  let nextStepTime = 0;
  let stepIdx = 0;
  const SCHEDULE_AHEAD = 0.1; // seconds
  const TICK_MS = 25;
  const guideGain = 0.7;     // guide track volume vs free play

  function stepDuration() {
    const bpm = Math.max(40, Math.min(240, parseInt($('bpm').value, 10) || 120));
    const speed = parseFloat($('speed').value) || 1;
    const stepsPerBeat = expanded.steps / 4;
    return (60 / (bpm * speed)) / stepsPerBeat;
  }

  function scheduleAtStep(time, idx) {
    const hits = expanded.rows[idx];
    // Click track
    if ($('metroOn').checked) {
      const stepsPerBeat = expanded.steps / 4;
      if (idx % stepsPerBeat === 0) {
        Drums.play(idx === 0 ? 'clickAccent' : 'click', time);
      }
    }
    // Guide track — play the actual drums (and visually cue + flash on schedule)
    if ($('guideOn').checked && hits.length) {
      hits.forEach((h) => Drums.play(PAD_VOICE[h.pad], time));
    }
    // visual update at the right time
    const ctxNow = Drums.now();
    const delayMs = Math.max(0, (time - ctxNow) * 1000);
    setTimeout(() => visualStep(idx), delayMs);
  }

  function visualStep(idx) {
    if (!isPlaying) return;
    // mark current row
    tabRows.forEach((r, i) => r.classList.toggle('current', i === idx));
    const cur = tabRows[idx];
    if (cur) {
      // keep the current row near the top of the visible area
      const parent = tabEl;
      const offset = cur.offsetTop - parent.offsetTop - 60;
      parent.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    }
    // cue the upcoming pads on the pad UI
    const hits = expanded.rows[idx];
    cuePads(hits.map((h) => h.pad));
    // flash the pads visually for the guide
    if ($('guideOn').checked) {
      hits.forEach((h) => flashPad(h.pad, 80));
    }
  }

  function scheduler() {
    const lookahead = Drums.now() + SCHEDULE_AHEAD;
    while (nextStepTime < lookahead) {
      scheduleAtStep(nextStepTime, stepIdx);
      // advance
      stepIdx = (stepIdx + 1) % expanded.steps;
      nextStepTime += stepDuration();
    }
  }

  function play() {
    if (!expanded) return;
    Drums.resume();
    if (isPlaying) return;
    isPlaying = true;
    $('playBtn').textContent = '❚❚ PAUSE';
    stepIdx = 0;
    const startDelay = $('countIn').checked ? countIn() : 0.05;
    nextStepTime = Drums.now() + startDelay;
    scheduleTimer = setInterval(scheduler, TICK_MS);
  }

  function stop() {
    isPlaying = false;
    clearInterval(scheduleTimer);
    scheduleTimer = null;
    $('playBtn').textContent = '▶ PLAY';
    tabRows.forEach((r) => r.classList.remove('current'));
    cuePads([]);
  }

  function countIn() {
    const dur = stepDuration() * (expanded.steps / 4); // one beat
    const start = Drums.now() + 0.05;
    for (let i = 0; i < 4; i++) {
      Drums.play(i === 0 ? 'clickAccent' : 'click', start + i * dur);
    }
    return 4 * dur + 0.05;
  }

  // ---------- Mode buttons ----------
  let mode = 'play';
  $('modePlay').addEventListener('click', () => setMode('play'));
  $('modeLearn').addEventListener('click', () => setMode('learn'));
  function setMode(m) {
    mode = m;
    $('modePlay').classList.toggle('active', m === 'play');
    $('modeLearn').classList.toggle('active', m === 'learn');
    if (m === 'learn') {
      $('guideOn').checked = true;
      $('metroOn').checked = true;
    } else {
      // Free play — assume djay is providing the audio, just pad
      $('guideOn').checked = false;
      $('metroOn').checked = false;
      stop();
    }
  }

  // ---------- Transport ----------
  $('playBtn').addEventListener('click', () => isPlaying ? stop() : play());
  $('stopBtn').addEventListener('click', stop);
  $('bpm').addEventListener('change', () => { /* picked up next step */ });
  $('speed').addEventListener('change', () => { /* picked up next step */ });

  // ---------- Keyboard ----------
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 8) { hitPad(n); return; }
    if (e.code === 'Space') { e.preventDefault(); isPlaying ? stop() : play(); }
  });

  // Touch — prevent zoom on double-tap pad
  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- Init ----------
  buildPad();
  buildSelect();
  loadSong(SONGS[0].id);
})();
