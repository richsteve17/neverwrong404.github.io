// Pad slots (vertical 2x4, snake from top-left going right and back):
//   1: hat (TL)        2: hat (TR)
//   4: kick (ML)       3: snare2 (MR)
//   5: kick (ML2)      6: snare2 (MR2)
//   8: crash (BL)      7: snareRoll (BR)
//
// In patterns we author by VOICE; the app auto-alternates between the two
// physical pads each time a voice fires (so playing feels ergonomic).
// voice -> pad slots:
const VOICE_PADS = {
  hat:        [1, 2],
  kick:       [4, 5],
  snare:      [3, 6],
  crash:      [8],
  roll:       [7],
};

// Helpers to author patterns succinctly
function fill(len) { return new Array(len).fill(0); }
function on(steps, len = 16) { const a = fill(len); steps.forEach(i => a[i] = 1); return a; }
function every(n, len = 16, off = 0) { const a = fill(len); for (let i = off; i < len; i += n) a[i] = 1; return a; }

// Default 8-slot custom build for a "rock" style — re-used by most songs
const ROCK_CUSTOMS = [
  'Closed Hat (acoustic) — slot 1',
  'Closed Hat (acoustic) — slot 2  (same as slot 1, lets you alternate hands)',
  'Snare — slot 3',
  'Kick — slot 4',
  'Kick — slot 5  (same as slot 4)',
  'Snare — slot 6  (same as slot 3)',
  'Snare Roll / 16th buzz — slot 7',
  'Crash Cymbal — slot 8',
];
const TRAP_CUSTOMS = [
  '808 Closed Hat — slot 1',
  '808 Closed Hat — slot 2',
  'Trap Snare / Clap — slot 3',
  '808 Sub Kick — slot 4',
  '808 Sub Kick — slot 5',
  'Trap Snare / Clap — slot 6',
  '808 Hat Roll (32nds) — slot 7',
  '808 Open Hat or Crash — slot 8',
];
const HIPHOP_CUSTOMS = [
  'Boom-Bap Closed Hat — slot 1',
  'Boom-Bap Closed Hat — slot 2',
  '90s Snare — slot 3',
  'Boom-Bap Kick — slot 4',
  'Boom-Bap Kick — slot 5',
  '90s Snare — slot 6',
  'Snare Roll — slot 7',
  'Vinyl Crash / Ride Bell — slot 8',
];
const ORCH_CUSTOMS = [
  'Tom / Taiko hi — slot 1',
  'Tom / Taiko hi — slot 2',
  'Snare hit — slot 3',
  'Timpani / Sub Boom — slot 4',
  'Timpani / Sub Boom — slot 5',
  'Snare hit — slot 6',
  'Snare Roll (military) — slot 7',
  'Crash / Gong — slot 8',
];
const CELTIC_CUSTOMS = [
  'Bodhran tip — slot 1',
  'Bodhran tip — slot 2',
  'Rim / Wood block — slot 3',
  'Bodhran low — slot 4',
  'Bodhran low — slot 5',
  'Rim / Wood block — slot 6',
  'Snare Roll (marching) — slot 7',
  'Crash — slot 8',
];

const SONGS = [
  {
    id: '01', title: 'Teenage Dirtbag', artist: 'Wheatus',
    bpm: 132, kit: 'Acoustic Rock Kit', customs: ROCK_CUSTOMS,
    notes: 'Steady rock beat. Verse uses light hats; chorus opens up. Crash on downbeat of chorus.',
    pattern: {
      steps: 16,
      hat: every(2),                     // 8th-note hats
      kick: on([0, 6, 8, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '02', title: 'The Rock Show', artist: 'Blink-182',
    bpm: 187, kit: 'Rock / Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Travis-style punk: kick on every quarter, snare on 2 & 4, fast 8th hats.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: every(4),                    // four-on-the-floor
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '03', title: 'Beat Your Heart Out', artist: 'The Distillers',
    bpm: 144, kit: 'Rock / Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Driving punk groove. Snare on 2 & 4, kick anchors with two hits per bar.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 8, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '04', title: 'Paper Planes', artist: 'M.I.A.',
    bpm: 84, kit: 'Hip Hop Kit', customs: HIPHOP_CUSTOMS,
    notes: 'Boom-bap groove. Half-time feel. Snare on 3 (step 8), kick on 1 and ghost between.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 6, 10]),
      snare: on([8]),
      crash: on([0]),
    },
  },
  {
    id: '05', title: 'Potato Salad', artist: 'Tyler, The Creator & A$AP Rocky',
    bpm: 90, kit: 'Lo-Fi Hip Hop Kit', customs: HIPHOP_CUSTOMS,
    notes: 'Laid-back loop. Sparse hats, lazy boom-bap kick/snare.',
    pattern: {
      steps: 16,
      hat: on([0, 4, 8, 12]),            // quarter notes only
      kick: on([0, 7]),
      snare: on([4, 12]),
      crash: [],
    },
  },
  {
    id: '06', title: 'The Rising Sun (Shinsuke Nakamura)', artist: 'CFO$',
    bpm: 100, kit: 'Cinematic / Taiko Kit', customs: ORCH_CUSTOMS,
    notes: 'Theatrical entrance. Big taiko hits on downbeats, snare roll into the hook.',
    pattern: {
      steps: 16,
      hat: [],
      kick: on([0, 4, 8, 12]),           // big tom/taiko on every beat
      snare: on([6, 14]),
      crash: on([0]),
      roll: on([15]),                    // roll into next bar
    },
  },
  {
    id: '07', title: 'Jet Black New Year', artist: 'Thursday',
    bpm: 150, kit: 'Rock / Post-Hardcore Kit', customs: ROCK_CUSTOMS,
    notes: 'Driving post-hardcore. Galloping kick pattern, snare on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 3, 8, 11]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '08', title: 'Celtic Invasion (Becky Lynch)', artist: 'CFO$',
    bpm: 130, kit: 'Celtic / Marching Kit', customs: CELTIC_CUSTOMS,
    notes: 'Marching feel with bodhran low hits. Snare flam on 2 & 4, roll at end of phrase.',
    pattern: {
      steps: 16,
      hat: on([2, 6, 10, 14]),
      kick: on([0, 4, 8, 12]),
      snare: on([4, 12]),
      crash: on([0]),
      roll: on([15]),
    },
  },
  {
    id: '09', title: 'B.O.B. (Bombs Over Baghdad)', artist: 'Outkast',
    bpm: 155, kit: 'Drum & Bass Kit', customs: HIPHOP_CUSTOMS,
    notes: 'Fast — basically D&B. 16th hats throughout, snare ghosts between 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(1),                     // 16th-note hats
      kick: on([0, 6, 10]),
      snare: on([4, 12]),
      crash: on([0]),
      roll: on([14]),
    },
  },
  {
    id: '10', title: "I'm Not Okay (I Promise)", artist: 'My Chemical Romance',
    bpm: 168, kit: 'Rock / Pop Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Pop-punk anthem. Verse simple, chorus four-on-the-floor with crash.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 4, 8, 12]),
      snare: on([4, 12]),
      crash: on([0, 8]),
    },
  },
  {
    id: '11', title: 'Feeling This', artist: 'Blink-182',
    bpm: 134, kit: 'Rock / Pop Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Travis Barker syncopation. Kick on 1 + & of 2 + 3, snare on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 6, 8, 14]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '12', title: 'Renegade', artist: 'Hed PE',
    bpm: 95, kit: 'Nu-Metal Kit', customs: ROCK_CUSTOMS,
    notes: 'Half-time nu-metal feel. Heavy kick on 1, snare on 3.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 2, 8, 10]),
      snare: on([8]),
      crash: on([0]),
    },
  },
  {
    id: '13', title: 'Worlds Apart (Sami Zayn)', artist: 'CFO$',
    bpm: 140, kit: 'Rock Kit', customs: ROCK_CUSTOMS,
    notes: 'Anthemic rock. Big snare on 2 & 4, crash on every downbeat in chorus.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 6, 8, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '14', title: 'Fell In Love With A Girl', artist: 'The White Stripes',
    bpm: 134, kit: 'Garage Rock Kit', customs: ROCK_CUSTOMS,
    notes: 'Meg White stomp. Just kick + snare alternating. No hats. Pure energy.',
    pattern: {
      steps: 16,
      hat: [],
      kick: on([0, 4, 8, 12]),
      snare: on([2, 6, 10, 14]),
      crash: on([0]),
    },
  },
  {
    id: '15', title: 'He Is', artist: 'Ghost',
    bpm: 88, kit: 'Acoustic Ballad Kit', customs: ROCK_CUSTOMS,
    notes: 'Slow ballad waltz-feel section, then a 4/4 lift. Pattern below is the lift.',
    pattern: {
      steps: 16,
      hat: on([0, 4, 8, 12]),
      kick: on([0, 8]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '16', title: 'Dreams Of Grandeur', artist: 'Insane Clown Posse',
    bpm: 88, kit: 'Hip Hop Kit', customs: HIPHOP_CUSTOMS,
    notes: 'Slow horror-rap beat. Kick on 1 and "and" of 3, snare on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '17', title: "Da Mystery of Chessboxin'", artist: 'Wu-Tang Clan',
    bpm: 92, kit: 'Boom-Bap Kit', customs: HIPHOP_CUSTOMS,
    notes: 'Classic 90s boom-bap. Kick on 1 + 3, hard snare on 2 + 4, swung 8ths.',
    pattern: {
      steps: 16,
      swing: 0.18,
      hat: every(2),
      kick: on([0, 8]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '18', title: 'Song of the Century', artist: 'Green Day',
    bpm: 110, kit: 'Acoustic Kit (brushes)', customs: ROCK_CUSTOMS,
    notes: 'Lo-fi megaphone intro — barely any drums. Just light snare brushes and kick on 1.',
    pattern: {
      steps: 16,
      hat: [],
      kick: on([0, 8]),
      snare: on([4, 12]),
      crash: [],
    },
  },
  {
    id: '19', title: 'The Night We Won It Six Times', artist: 'BOSS',
    bpm: 175, kit: 'Hardcore Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Fast hardcore. Pretty much constant 8th-note kick, snare on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: every(2),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '20', title: 'Walking Harder', artist: 'Fat Nick',
    bpm: 150, kit: 'Trap / 808 Kit', customs: TRAP_CUSTOMS,
    notes: 'Trap — half-time feel. Big snare/clap on 3, sparse 808 kick. Hats roll on the "ah" of 2.',
    pattern: {
      steps: 16,
      hat: on([0, 2, 4, 6, 7, 8, 10, 12, 14]),
      kick: on([0, 6, 10]),
      snare: on([8]),
      crash: on([0]),
      roll: on([7]),
    },
  },
  {
    id: '21', title: 'The Dirty Glass', artist: 'Dropkick Murphys',
    bpm: 150, kit: 'Celtic Punk Kit', customs: CELTIC_CUSTOMS,
    notes: 'Pub-stomp celtic punk. 4-on-the-floor kick, snare on 2 & 4, big crash on 1.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: every(4),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '22', title: 'Nikes', artist: 'Frank Ocean',
    bpm: 70, kit: 'Lo-Fi R&B Kit', customs: TRAP_CUSTOMS,
    notes: 'Slow, hazy. Sub-kick on 1 and "and" of 2, snap/snare on 2 & 4. Sparse hats.',
    pattern: {
      steps: 16,
      hat: on([0, 4, 8, 12]),
      kick: on([0, 6]),
      snare: on([4, 12]),
      crash: [],
    },
  },
  {
    id: '25', title: 'Sloop John B', artist: 'The Beach Boys',
    bpm: 105, kit: 'Acoustic Kit', customs: ROCK_CUSTOMS,
    notes: 'Simple folk-pop beat. Kick on 1 & 3, snare on 2 & 4, ride on 8ths.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 8]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '26', title: 'Excuse Me', artist: 'A$AP Rocky',
    bpm: 70, kit: 'Cloud Trap Kit', customs: TRAP_CUSTOMS,
    notes: 'Slow cloudy trap. 808 kick on 1, snap on 3 (step 8). Skittery hat rolls.',
    pattern: {
      steps: 16,
      hat: on([0, 2, 4, 6, 7, 8, 10, 12, 14, 15]),
      kick: on([0, 11]),
      snare: on([8]),
      crash: [],
      roll: on([15]),
    },
  },
  {
    id: '27', title: 'Turn It Up (Bayley)', artist: 'CFO$',
    bpm: 140, kit: 'Pop Rock Kit', customs: ROCK_CUSTOMS,
    notes: 'Upbeat pop rock. Four-on-the-floor kick, claps on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: every(4),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '28', title: 'The Little Things', artist: 'Good Charlotte',
    bpm: 150, kit: 'Pop Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Standard pop-punk groove. Kick on 1 + "and" of 2, snare on 2 & 4.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 6, 8]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '29', title: 'Kingslayer', artist: 'Bring Me The Horizon (feat. BABYMETAL)',
    bpm: 174, kit: 'Metalcore Kit', customs: ROCK_CUSTOMS,
    notes: 'Aggressive double-kick verses, huge snare on 2 & 4. Crash hits with riff downbeats.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 1, 6, 7, 8, 9, 14, 15]),
      snare: on([4, 12]),
      crash: on([0, 8]),
    },
  },
  {
    id: '30', title: 'Badly Educated', artist: 'Fat Nick',
    bpm: 140, kit: 'Trap / 808 Kit', customs: TRAP_CUSTOMS,
    notes: 'Trap, half-time. 808 kick syncopated, snare on 3, hat triplet roll into the bar.',
    pattern: {
      steps: 16,
      hat: on([0, 2, 4, 6, 7, 8, 10, 12, 14]),
      kick: on([0, 5, 10]),
      snare: on([8]),
      crash: on([0]),
      roll: on([15]),
    },
  },
  {
    id: '31', title: 'Gaslight', artist: 'WILLOW',
    bpm: 165, kit: 'Pop Punk Kit', customs: ROCK_CUSTOMS,
    notes: 'Driving pop-punk, very straightforward. Kick on 1, snare on 2 & 4, fast 8th hats.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 8, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
  {
    id: '32', title: 'Clint Eastwood', artist: 'Gorillaz',
    bpm: 84, kit: 'Trip Hop / Hip Hop Kit', customs: HIPHOP_CUSTOMS,
    notes: 'That iconic loop. Kick on 1, snare on 2 & 4, lazy 8th hats. Crash hit at top of chorus.',
    pattern: {
      steps: 16,
      hat: every(2),
      kick: on([0, 6, 10]),
      snare: on([4, 12]),
      crash: on([0]),
    },
  },
];

// Expand a song's voice-pattern into a flat per-step list of pad slots,
// auto-alternating between left/right pads of paired voices.
function expandPattern(song) {
  const p = song.pattern;
  const steps = p.steps || 16;
  const out = [];
  // counters to alternate pad pairs
  const ctr = { hat: 0, kick: 0, snare: 0, crash: 0, roll: 0 };
  for (let s = 0; s < steps; s++) {
    const hits = [];
    ['kick', 'hat', 'snare', 'roll', 'crash'].forEach(v => {
      const arr = p[v] || [];
      if (arr[s]) {
        const pads = VOICE_PADS[v];
        const pad = pads[ctr[v] % pads.length];
        hits.push({ voice: v, pad });
        ctr[v]++;
      }
    });
    out.push(hits);
  }
  return { steps, swing: p.swing || 0, rows: out };
}

// Pad metadata used by the UI
const PAD_DEF = [
  { num: 1, voice: 'hat',       label: 'HAT',   sub: 'L', cls: 'hat' },
  { num: 2, voice: 'hat',       label: 'HAT',   sub: 'R', cls: 'hat' },
  { num: 4, voice: 'kick',      label: 'KICK',  sub: 'L', cls: 'kick' },
  { num: 3, voice: 'snare',     label: 'SNARE', sub: 'R', cls: 'snare' },
  { num: 5, voice: 'kick',      label: 'KICK',  sub: 'L', cls: 'kick' },
  { num: 6, voice: 'snare',     label: 'SNARE', sub: 'R', cls: 'snare' },
  { num: 8, voice: 'crash',     label: 'CRASH', sub: '',  cls: 'crash' },
  { num: 7, voice: 'roll',      label: 'ROLL',  sub: '',  cls: 'snareroll' },
];
// Maps pad-number -> playable Drums voice
const PAD_VOICE = {
  1: 'hat', 2: 'hat',
  3: 'snare2', 4: 'kick', 5: 'kick', 6: 'snare2',
  7: 'snareRoll', 8: 'crash',
};
// Voice -> css class name (for chip in tab)
const VOICE_CLASS = {
  hat: 'hat', kick: 'kick', snare: 'snare', roll: 'snareroll', crash: 'crash',
};
