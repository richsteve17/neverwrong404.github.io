// Main controller
(() => {
  const $ = (id) => document.getElementById(id);
  const padEl = $('pad');
  const tabEl = $('tab');
  const songSelect = $('songSelect');

  let currentSong = null;
  let expanded = null;
  let currentSections = [];
  let currentSectionIdx = 0;
  // voice mute state — true = ON (play it), false = muted
  const voiceOn = { hat: true, kick: true, snare: true, roll: true, crash: true };

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
    currentSections = getSections(s);
    currentSectionIdx = 0;
    $('songTitle').textContent = `${s.id} · ${s.title}`;
    $('songArtist').textContent = s.artist;
    $('kitInfo').textContent = `Suggested kit: ${s.kit}`;
    const cust = $('customList');
    cust.innerHTML = '';
    s.customs.forEach((line) => {
      const li = document.createElement('li');
      li.textContent = line;
      cust.appendChild(li);
    });
    $('bpm').value = s.bpm;
    buildSectionChips();
    selectSection(0, /*seekYT=*/false);
    stop();

    // YouTube: load saved or default video for this song
    const savedId = localStorage.getItem('drumpad:yt:' + s.id) || s.youtubeId || '';
    $('ytInput').value = savedId;
    loadYouTube(savedId, false);

    // SEARCH link
    const q = encodeURIComponent(`${s.artist} ${s.title} official audio`);
    $('ytSearch').href = `https://www.youtube.com/results?search_query=${q}`;
  }

  // ---------- Sections ----------
  function buildSectionChips() {
    const host = $('sections');
    host.innerHTML = '';
    if (currentSections.length <= 1) return; // hide for single-loop songs
    currentSections.forEach((sec, i) => {
      const b = document.createElement('button');
      b.className = 'sec-chip';
      b.dataset.idx = i;
      b.innerHTML = `<span>${sec.name}</span><span class="b">${sec.bars}b</span>`;
      b.addEventListener('click', () => selectSection(i, /*seekYT=*/true));
      host.appendChild(b);
    });
  }

  function selectSection(idx, seekYT) {
    if (!currentSections[idx]) return;
    currentSectionIdx = idx;
    const sec = currentSections[idx];
    expanded = expandStepPattern(sec);
    $('songNotes').textContent = sec.notes || currentSong.notes || '';
    Array.from($('sections').children).forEach((c, i) =>
      c.classList.toggle('active', i === idx));
    autoMuteForSection(sec);
    buildTab();
    if (isPlaying) {
      stepIdx = 0;
      nextStepTime = Drums.now() + 0.005;
    }
    if (seekYT && ytReady && ytPlayer && typeof sec.startMs === 'number') {
      try { ytPlayer.seekTo(sec.startMs / 1000, true); } catch (_) {}
    }
  }

  // If a section has unplayable density on a voice (e.g. 16th-note tambourine
  // = 8 hits/sec at 124 BPM), default-mute that voice. The user can re-enable it.
  function autoMuteForSection(sec) {
    const stepsPerBeat = sec.steps / 4;
    const countHits = (arr) => (arr || []).filter(Boolean).length;
    // tambourine / roll: if it hits >50% of all 16th-note steps, mute it
    if (sec.steps >= 16 && countHits(sec.roll) > sec.steps * 0.5) {
      voiceOn.roll = false;
    } else if (countHits(sec.roll) > 0) {
      voiceOn.roll = true;
    }
    // hat: if it hits every step (16ths), mute by default
    if (sec.steps >= 16 && countHits(sec.hat) >= sec.steps) {
      voiceOn.hat = false;
    }
    // crash: keep on by default
    refreshVoiceToggles();
  }

  // Find which section contains a given playback time (ms).
  function sectionForTimeMs(ms) {
    for (let i = currentSections.length - 1; i >= 0; i--) {
      const s = currentSections[i];
      if (typeof s.startMs === 'number' && ms >= s.startMs) return i;
    }
    return 0;
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
      const chips = hits
        .filter((h) => voiceOn[h.voice])
        .map((h) => `<span class="chip ${VOICE_CLASS[h.voice]}">${h.pad}</span>`)
        .join('');
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

  function stepDuration() {
    const bpm = Math.max(40, Math.min(240, parseInt($('bpm').value, 10) || 120));
    const speed = parseFloat($('speed').value) || 1;
    const stepsPerBeat = expanded.steps / 4;
    return (60 / (bpm * speed)) / stepsPerBeat;
  }

  function scheduleAtStep(time, idx) {
    const hits = expanded.rows[idx];
    if ($('metroOn').checked) {
      const stepsPerBeat = expanded.steps / 4;
      if (idx % stepsPerBeat === 0) {
        Drums.play(idx === 0 ? 'clickAccent' : 'click', time);
      }
    }
    if ($('guideOn').checked && hits.length) {
      hits.forEach((h) => { if (voiceOn[h.voice]) Drums.play(PAD_VOICE[h.pad], time); });
    }
    const ctxNow = Drums.now();
    const delayMs = Math.max(0, (time - ctxNow) * 1000);
    setTimeout(() => visualStep(idx), delayMs);
  }

  function visualStep(idx) {
    if (!isPlaying) return;
    tabRows.forEach((r, i) => r.classList.toggle('current', i === idx));
    const cur = tabRows[idx];
    if (cur) {
      const parent = tabEl;
      const offset = cur.offsetTop - parent.offsetTop - 60;
      parent.scrollTo({ top: Math.max(0, offset), behavior: 'smooth' });
    }
    const hits = expanded.rows[idx].filter((h) => voiceOn[h.voice]);
    cuePads(hits.map((h) => h.pad));
    if ($('guideOn').checked) {
      hits.forEach((h) => flashPad(h.pad, 80));
    }
  }

  function scheduler() {
    const lookahead = Drums.now() + SCHEDULE_AHEAD;
    while (nextStepTime < lookahead) {
      scheduleAtStep(nextStepTime, stepIdx);
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

  // Re-align the loop to the user's tap (downbeat = step 0)
  function syncDownbeat() {
    if (!expanded) return;
    Drums.resume();
    if (!isPlaying) {
      // start the loop on this tap
      isPlaying = true;
      $('playBtn').textContent = '❚❚ PAUSE';
      stepIdx = 0;
      nextStepTime = Drums.now() + 0.005;
      scheduleTimer = setInterval(scheduler, TICK_MS);
    } else {
      // realign — next step is step 0
      stepIdx = 0;
      nextStepTime = Drums.now() + 0.005;
    }
    flashSync();
  }
  function flashSync() {
    const b = $('syncBtn');
    b.classList.add('hit');
    setTimeout(() => b.classList.remove('hit'), 120);
  }

  function countIn() {
    const dur = stepDuration() * (expanded.steps / 4);
    const start = Drums.now() + 0.05;
    for (let i = 0; i < 4; i++) {
      Drums.play(i === 0 ? 'clickAccent' : 'click', start + i * dur);
    }
    return 4 * dur + 0.05;
  }

  // ---------- YouTube ----------
  let ytPlayer = null;
  let ytReady = false;
  let pendingVideoId = null;

  window.onYouTubeIframeAPIReady = () => {
    ytPlayer = new YT.Player('ytPlayer', {
      width: '100%', height: '100%',
      videoId: '',
      playerVars: { playsinline: 1, modestbranding: 1, rel: 0 },
      events: {
        onReady: () => {
          ytReady = true;
          if (pendingVideoId) loadYouTube(pendingVideoId, false);
        },
        onStateChange: (e) => {
          // 1 = playing — when YouTube starts, mute the synth guide automatically
          if (e.data === YT.PlayerState.PLAYING) {
            $('guideOn').checked = false;
          }
        },
      },
    });
  };

  function parseVideoId(input) {
    if (!input) return '';
    const s = input.trim();
    // raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(s)) return s;
    // youtu.be/<id>
    let m = s.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/watch?v=<id>
    m = s.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/embed/<id>
    m = s.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    // youtube.com/shorts/<id>
    m = s.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[1];
    return '';
  }

  function loadYouTube(input, persist = true) {
    const id = parseVideoId(input);
    if (!id) {
      // empty / bad — clear player
      if (ytReady && ytPlayer) ytPlayer.stopVideo && ytPlayer.stopVideo();
      return;
    }
    if (!ytReady) { pendingVideoId = id; return; }
    ytPlayer.cueVideoById(id);
    if (persist && currentSong) {
      localStorage.setItem('drumpad:yt:' + currentSong.id, id);
    }
  }

  $('ytLoad').addEventListener('click', () => loadYouTube($('ytInput').value, true));
  $('ytInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); loadYouTube($('ytInput').value, true); }
  });
  $('syncBtn').addEventListener('click', syncDownbeat);

  // ---------- Voice mute toggles ----------
  function refreshVoiceToggles() {
    document.querySelectorAll('#voiceToggles .vt').forEach((b) => {
      const v = b.dataset.voice;
      const on = !!voiceOn[v];
      b.classList.toggle('on', on);
      b.classList.toggle('off', !on);
    });
  }
  document.querySelectorAll('#voiceToggles .vt').forEach((b) => {
    b.addEventListener('click', () => {
      const v = b.dataset.voice;
      voiceOn[v] = !voiceOn[v];
      refreshVoiceToggles();
      buildTab();
    });
  });
  refreshVoiceToggles();

  // Auto-follow: when YT is playing, switch the loop's section to the one
  // containing the current playback time.
  setInterval(() => {
    if (!$('autoFollow').checked) return;
    if (!ytReady || !ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
    if (currentSections.length <= 1) return;
    let t;
    try { t = ytPlayer.getCurrentTime(); } catch (_) { return; }
    const ms = t * 1000;
    const idx = sectionForTimeMs(ms);
    if (idx !== currentSectionIdx) selectSection(idx, /*seekYT=*/false);
  }, 500);

  // ---------- Mode buttons ----------
  $('modePlay').addEventListener('click', () => setMode('play'));
  $('modeLearn').addEventListener('click', () => setMode('learn'));
  function setMode(m) {
    $('modePlay').classList.toggle('active', m === 'play');
    $('modeLearn').classList.toggle('active', m === 'learn');
    if (m === 'learn') {
      $('guideOn').checked = true;
      $('metroOn').checked = true;
    } else {
      $('guideOn').checked = false;
      $('metroOn').checked = false;
      stop();
    }
  }

  // ---------- Transport ----------
  $('playBtn').addEventListener('click', () => isPlaying ? stop() : play());
  $('stopBtn').addEventListener('click', stop);

  // ---------- Keyboard ----------
  window.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    const n = parseInt(e.key, 10);
    if (n >= 1 && n <= 8) { hitPad(n); return; }
    if (e.code === 'Space') { e.preventDefault(); isPlaying ? stop() : play(); }
    if (e.key === 't' || e.key === 'T') { e.preventDefault(); syncDownbeat(); }
  });

  document.addEventListener('gesturestart', (e) => e.preventDefault());

  // ---------- Init ----------
  buildPad();
  buildSelect();
  loadSong(SONGS[0].id);
})();
