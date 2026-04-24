// Web Audio drum synth. No file loading -> instant boot.
// Voices: kick, snare, snare2 (tighter), snareRoll, hat, hatOpen, crash, click

const Drums = (() => {
  let ctx;
  let master;
  let noiseBuf;

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.9;
    master.connect(ctx.destination);

    // pre-build a 1s noise buffer
    noiseBuf = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }

  function noise(when, dur) {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuf;
    src.start(when);
    src.stop(when + dur + 0.05);
    return src;
  }
  function env(when, attack, decay, peak = 1) {
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, when);
    g.gain.linearRampToValueAtTime(peak, when + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, when + attack + decay);
    return g;
  }

  function kick(when = 0, vel = 1) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(40, t + 0.12);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(1 * vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45);
    // click for attack
    const cn = noise(t, 0.02);
    const cg = env(t, 0.001, 0.02, 0.4 * vel);
    const cf = ctx.createBiquadFilter();
    cf.type = 'highpass'; cf.frequency.value = 1500;
    cn.connect(cf).connect(cg).connect(master);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + 0.5);
  }

  function snare(when = 0, vel = 1) {
    const t = when || ctx.currentTime;
    // body tone
    const o = ctx.createOscillator();
    o.type = 'triangle';
    o.frequency.setValueAtTime(220, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.08);
    const og = env(t, 0.001, 0.12, 0.5 * vel);
    o.connect(og).connect(master);
    o.start(t); o.stop(t + 0.2);
    // noise crack
    const n = noise(t, 0.2);
    const f = ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 1200;
    const ng = env(t, 0.001, 0.16, 0.9 * vel);
    n.connect(f).connect(ng).connect(master);
  }

  // Tighter, snappier — for snare2 slot
  function snare2(when = 0, vel = 1) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = 'square';
    o.frequency.setValueAtTime(280, t);
    o.frequency.exponentialRampToValueAtTime(180, t + 0.05);
    const og = env(t, 0.001, 0.07, 0.35 * vel);
    o.connect(og).connect(master);
    o.start(t); o.stop(t + 0.12);
    const n = noise(t, 0.1);
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass'; f.frequency.value = 2400; f.Q.value = 0.6;
    const ng = env(t, 0.001, 0.09, 0.85 * vel);
    n.connect(f).connect(ng).connect(master);
  }

  // Buzzy roll
  function snareRoll(when = 0, vel = 1, length = 0.18) {
    const t = when || ctx.currentTime;
    const hits = 8;
    for (let i = 0; i < hits; i++) {
      const ht = t + (i * length / hits);
      snare2(ht, vel * (0.6 + 0.4 * Math.random()));
    }
  }

  function hat(when = 0, vel = 1, open = false) {
    const t = when || ctx.currentTime;
    const dur = open ? 0.25 : 0.05;
    const n = noise(t, dur + 0.05);
    const f = ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 7000;
    const f2 = ctx.createBiquadFilter();
    f2.type = 'bandpass'; f2.frequency.value = 10000; f2.Q.value = 0.8;
    const g = env(t, 0.001, dur, 0.55 * vel);
    n.connect(f).connect(f2).connect(g).connect(master);
  }
  function hatOpen(when, vel) { hat(when, vel, true); }

  function crash(when = 0, vel = 1) {
    const t = when || ctx.currentTime;
    const n = noise(t, 1.2);
    const f = ctx.createBiquadFilter();
    f.type = 'highpass'; f.frequency.value = 4000;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.6 * vel, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
    n.connect(f).connect(g).connect(master);
  }

  // Metronome click
  function click(when = 0, accent = false) {
    const t = when || ctx.currentTime;
    const o = ctx.createOscillator();
    o.frequency.value = accent ? 1600 : 1000;
    const g = env(t, 0.001, 0.04, accent ? 0.35 : 0.2);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + 0.06);
  }

  function resume() { ensure(); if (ctx.state === 'suspended') ctx.resume(); }
  function now() { ensure(); return ctx.currentTime; }
  function context() { ensure(); return ctx; }

  // Generic dispatch by voice name
  function play(voice, when, vel = 1) {
    ensure();
    switch (voice) {
      case 'kick': return kick(when, vel);
      case 'snare': return snare(when, vel);
      case 'snare2': return snare2(when, vel);
      case 'snareRoll': return snareRoll(when, vel);
      case 'hat': return hat(when, vel);
      case 'hatOpen': return hatOpen(when, vel);
      case 'crash': return crash(when, vel);
      case 'click': return click(when, false);
      case 'clickAccent': return click(when, true);
    }
  }

  return { resume, now, play, context, kick, snare, snare2, snareRoll, hat, hatOpen, crash, click };
})();
