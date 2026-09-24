/* ══════════════════════════════════════════
   SEVEN WONDERS - WORD PLAYGROUND
   ══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── DOM refs ──
  const gameWorld = document.getElementById('gameWorld');
  const wordInput = document.getElementById('wordInput');
  const addBtn = document.getElementById('addBtn');
  const chipArea = document.getElementById('chipArea');
  const emptyHint = document.getElementById('emptyHint');
  const resetBtn = document.getElementById('resetBtn');
  const surpriseBtn = document.getElementById('surpriseBtn');
  const toast = document.getElementById('toast');
  const categoryEmoji = document.getElementById('categoryEmoji');
  const categoryText = document.getElementById('categoryText');
  const wotdWord = document.getElementById('wotdWord');
  const wotdHint = document.getElementById('wotdHint');
  const wotdClaim = document.getElementById('wotdClaim');
  const wotdBanner = document.getElementById('wotdBanner');

  // Mode screen
  const modeScreen = document.getElementById('modeScreen');
  const modeSolo = document.getElementById('modeSolo');
  const modeDuo = document.getElementById('modeDuo');
  const playerSetup = document.getElementById('playerSetup');
  const p1NameInput = document.getElementById('p1Name');
  const p2NameInput = document.getElementById('p2Name');
  const modeGo = document.getElementById('modeGo');
  const wordPanel = document.getElementById('wordPanel');

  // 2P UI
  const turnBar = document.getElementById('turnBar');
  const p1Tag = document.getElementById('p1Tag');
  const p2Tag = document.getElementById('p2Tag');
  const p1TagName = document.getElementById('p1TagName');
  const p2TagName = document.getElementById('p2TagName');
  const p1Score = document.getElementById('p1Score');
  const p2Score = document.getElementById('p2Score');
  const activeTurn = document.getElementById('activeTurn');
  const activeTurnName = document.getElementById('activeTurnName');
  const pointsPopup = document.getElementById('pointsPopup');
  const leaderboard = document.getElementById('leaderboard');
  const leaderboardEntries = document.getElementById('leaderboardEntries');
  const streakCounter = document.getElementById('streakCounter');

  // ── State ──
  let colorIndex = 0;
  let wordCount = 0;
  let is2P = false;
  let currentPlayer = 1; // 1 or 2
  let turnCount = 0;
  const players = {
    1: { name: 'Player 1', score: 0, words: [], color: '#FF6B8A' },
    2: { name: 'Player 2', score: 0, words: [], color: '#48DBFB' },
  };
  const CHIP_COLORS = [
    'chip-coral', 'chip-orange', 'chip-yellow', 'chip-mint',
    'chip-lavender', 'chip-peach', 'chip-sky'
  ];
  const placedWords = [];
  const leaderboardData = [];

  // ── Target positions for two-stage sequential placement ──
  // Coordinates are percentages of the actual img8 image dimensions.
  // Measured by finding the CENTER of each numbered circle marker.
  // Stage 1: Numbered markers on principal room parts (words 1-10)
  // Stage 2: Bottom information cards (words 11-20)
  const mainTargets = [
    // Stage 1 — Center of each numbered circle in the principal room photo
    { number: 1,  name: "WINDOW",                     x: 8.0,  y: 25.0 },
    { number: 2,  name: "BOOKSHELF",                  x: 22.0, y: 22.0 },
    { number: 3,  name: "PRINCIPAL DESK",             x: 36.0, y: 42.0 },
    { number: 4,  name: "NOTICE BOARD / VISION BOARD",x: 48.0, y: 14.0 },
    { number: 5,  name: "CERTIFICATES / AWARDS",      x: 62.0, y: 16.0 },
    { number: 6,  name: "DOOR",                       x: 72.0, y: 22.0 },
    { number: 7,  name: "FILING CABINET",             x: 82.0, y: 32.0 },
    { number: 8,  name: "COMPUTER / TELEPHONE",       x: 92.0, y: 42.0 },
    { number: 9,  name: "VISITOR CHAIRS",             x: 22.0, y: 60.0 },
    { number: 10, name: "CENTER TABLE",               x: 46.0, y: 62.0 },
  ];

  const bottomTargets = [
    // Stage 2 — Center of numbered circles on the 10 bottom info cards
    // Cards are evenly spaced: each 10% wide, circles in the title bar
    { number: 1,  name: "WINDOW CARD",                x: 5.0,  y: 83.0 },
    { number: 2,  name: "BOOKSHELF CARD",             x: 15.0, y: 83.0 },
    { number: 3,  name: "PRINCIPAL DESK CARD",        x: 25.0, y: 83.0 },
    { number: 4,  name: "NOTICE BOARD CARD",          x: 35.0, y: 83.0 },
    { number: 5,  name: "CERTIFICATES CARD",          x: 45.0, y: 83.0 },
    { number: 6,  name: "DOOR CARD",                  x: 55.0, y: 83.0 },
    { number: 7,  name: "FILING CABINET CARD",        x: 65.0, y: 83.0 },
    { number: 8,  name: "COMPUTER CARD",              x: 75.0, y: 83.0 },
    { number: 9,  name: "VISITOR CHAIRS CARD",        x: 85.0, y: 83.0 },
    { number: 10, name: "CENTER TABLE CARD",          x: 95.0, y: 83.0 },
  ];

  // ── Preload image to get actual dimensions ──
  let imgNaturalW = 0, imgNaturalH = 0;
  const bgImg = new Image();
  bgImg.src = 'assets/img8.jpg';
  bgImg.onload = function() {
    imgNaturalW = bgImg.naturalWidth;
    imgNaturalH = bgImg.naturalHeight;
  };

  let placedCount = 0;

  // ── Streak state ──
  let streakCount = 0;
  let streakTimeout = null;
  const STREAK_MESSAGES = [
    { min: 3, text: "You've made 3 landmarks laugh! {emoji}", emoji: "🎉" },
    { min: 5, text: "5 landmarks are giggling! {emoji}", emoji: "😂" },
    { min: 8, text: "8 landmarks can't stop laughing! {emoji}", emoji: "🤣" },
    { min: 10, text: "10 landmarks are rolling! {emoji}", emoji: "🥳" },
    { min: 15, text: "15 landmarks are in stitches! {emoji}", emoji: "🎊" },
    { min: 20, text: "20 landmarks are WHEEZING! {emoji}", emoji: "🏆" },
  ];
  let lastStreakMilestone = 0;

  // ── Helpers ──
  function nextChipColor() {
    const c = CHIP_COLORS[colorIndex % CHIP_COLORS.length];
    colorIndex++;
    return c;
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ══════════════════════════════════════════
  //  THEME DETECTION — Scoring bonuses
  // ══════════════════════════════════════════
  const THEMES = {
    animal: {
      words: [
        'CAT','DOG','BIRD','FISH','FROG','BEAR','LION','TIGER','HORSE','COW',
        'PIG','DUCK','GOAT','DEER','WOLF','SEAL','CRAB','WHALE','SHARK','EAGLE',
        'PENGUIN','ELEPHANT','MONKEY','RABBIT','SNAKE','SPIDER','DOLPHIN','PANDA',
        'WALRUS','PARROT','TURTLE','DONKEY','MOUSE','RAT','BEE','ANT','FLY',
        'OWL','BAT','FOX','CROW','HEN','CAMEL','LLAMA','SHEEP','BUFFALO',
        'RACCOON','SLOTH','OTTER','WALRUS','HYENA','MOOSE','ELK','GOOSE',
        'AXOLOTL','NARWHAL','PLATYPUS','QUOKKA','PANGOLIN','CASSOWARY',
        'WOLVERINE','CAPYBARA','FENNEC','IGUANA','CHAMELEON','JELLYFISH',
        'OCTOPUS','LOBSTER','HAMSTER','GUINEA','CHICKEN','TURKEY','PEACOCK',
        'FLAMINGO','PLOVER','SWAN','CRANE','ROBIN','HAWK','FALCON','DOVE',
        'PUFFIN','TOUCAN','STORK','WOODPECKER','SPARROW','FINCH','NUTHATCH',
      ],
      bonus: 5,
      emoji: '&#128062;',
      label: 'Animal',
    },
    food: {
      words: [
        'PIZZA','TACO','BURRITO','PASTA','SOUP','SALAD','BREAD','CAKE','PIE',
        'COOKIE','MUFFIN','WAFFLE','PANCAKE','DONUT','PRETZEL','NOODLE','RICE',
        'CHEESE','BUTTER','MILK','JUICE','WATER','LEMON','MANGO','BERRY',
        'GRAPE','PEACH','PLUM','BANANA','APPLE','ORANGE','CHERRY','OLIVE',
        'ONION','GARLIC','PEPPER','SALT','SUGAR','HONEY','CREAM','YOGURT',
        'SPAGHETTI','DUMPLING','CUPCAKE','SUNDAE','PUDDING','WAFFLE',
        'BROWNIE','MUFFIN','Pretzel','CHOCOLATE','CARAMEL','VANILLA',
        'STRAWBERRY','BLUEBERRY','RASPBERRY','WATERMELON','PINEAPPLE',
        'AVOCADO','CUCUMBER','TOMATO','POTATO','CARROT','BROCCOLI',
        'LETTUCE','SPINACH','MUSHROOM','PEANUT','ALMOND','CASHEW',
        'BISCUIT','CRACKER','CEREAL','GRANOLA','YOGURT','JELLO',
        'KETCHUP','MUSTARD','MAYO','SALSA','HUMMUS','HUMMUS',
        'CHICKEN','BACON','SAUSAGE','STEAK','BURGER','HOTDOG',
        'SUSHI','RAMEN','TEMPURA','DUMPLING','SPRINGROLL','FRIEDRICE',
        'SHRIMP','SQUID','SCALLOP','MUSSEL','CLAM','OYSTER',
        'CINNAMON','GINGER','TURMERIC','CUMIN','PAPRIKA','BASIL',
        'CILANTRO','MINT','THYME','SAGE','OREGANO','DILL',
      ],
      bonus: 5,
      emoji: '&#127843;',
      label: 'Food',
    },
    color: {
      words: [
        'RED','BLUE','GREEN','YELLOW','ORANGE','PINK','PURPLE','WHITE','BLACK',
        'BROWN','GRAY','GREY','SILVER','GOLD','NAVY','TEAL','CYAN','MAGENTA',
        'LIME','CORAL','SALMON','TURQUOISE','VIOLET','INDIGO','MAROON',
        'CRIMSON','SCARLET','AMBER','AQUA','AZURE','BEIGE','BURGUNDY',
        'CHARCOAL','CREAM','FUCHSIA','GREY','HONEYDEW','IVORY','KHAKI',
        'LAVENDER','MAHOGANY','MINT','MOCASSIN','MOSS','OCHRE','OLIVE',
        'PEARL','PLUM','RUBY','RUST','SAFFRON','SANDY','SIENNA',
        'TAN','TURQUOISE','WHEAT','WINE','EMERALD','SAPPHIRE','JADE',
        'COPPER','BRONZE','PASTEL','NEON','IRIDESCENT','CHROMATIC',
      ],
      bonus: 5,
      emoji: '&#127912;',
      label: 'Color',
    },
    nature: {
      words: [
        'SUN','MOON','STAR','CLOUD','RAIN','SNOW','WIND','FIRE','WATER','EARTH',
        'TREE','FLOWER','LEAF','GRASS','SEED','ROOT','BRANCH','BARK','Moss',
        'ROCK','STONE','SAND','MUD','DIRT','DUST','ASH','ICE','FOG','MIST',
        'WAVE','TIDE','STREAM','RIVER','LAKE','POND','OCEAN','SEA','GULF',
        'MOUNTAIN','HILL','VALLEY','CANYON','DESERT','JUNGLE','FOREST',
        'ISLAND','BEACH','CLIFF','CAVE','Cavern','LAGOON','MEADOW',
        'PRAIRIE','TUNDRA','VOLCANO','GLACIER','GEYSER','OASIS',
        'AURORA','ECLIPSE','THUNDER','LIGHTNING','STORM','HURRICANE',
        'TORNADO','CYCLONE','RAINBOW','FOGGY','CLOUDY','SUNNY',
        'BREEZE','GALE','BLIZZARD','DRIZZLE','DOWNPOUR','HAIL',
      ],
      bonus: 3,
      emoji: '&#127793;',
      label: 'Nature',
    },
    magic: {
      words: [
        'WIZARD','DRAGON','UNICORN','PHOENIX','GOBLIN','TROLL','FAIRY','ELF',
        'DWARF','WITCH','SPELL','POTION','WAND','CAULDRON','MYSTIC','ARCANE',
        'SORCERY','ENCHANT','CHARM','RIDDLE','MYTH','LEGEND','FABLE',
        'MYSTICAL','ETHEREAL','CELESTIAL','MAGICAL','MYSTERIOUS','ENCHANTED',
        'SPARKLE','GLITTER','SHIMMER','GLOW','RADIANT','LUMINOUS','DREAM',
        'FANTASY','LEGENDARY','MYTHICAL','FABULOUS','INCREDIBLE','SPECTACULAR',
        'INCREDIBLE','WONDERFUL','AMAZING','FANTASTIC','MARVELOUS','BRILLIANT',
      ],
      bonus: 4,
      emoji: '&#128302;',
      label: 'Magic',
    },
  };

  // Silly / funny words bonus
  const SILLY_WORDS = [
    'WOBBLE','BOING','SQUISH','GOBBLE','SNOZZLE','Flibbert','PLOPPER',
    'SNOOT','BUTT','POOP','FART','BUMBLE','GRUMBLE','STUMBLE','TUMBLE',
    'BUMBLEBEE','WOMBAT','Noodles','WHOMPUS','FUZZBUCKET','DOODLEBUG',
    'KAZOO','SPROCKET','BLUBBER','GIGGLES','SNICKLE','BAMBOOZLE','WHOOPTIE',
    'GOOFY','SILLY','GOOBER','NINCOMPOOP','BUMFLOOZLE','SPELUNKING','BUMPKIN',
    'CUSTARD','FLAPJACK','NINNY','TWIDDLE','WADDLE','GARGLE','TOODLES',
    'KERFUFFLE','SHENANIGANS','BUFFOON','CLOWN','JOKER','PRANKSTER',
    'GIGGLED','SNORTLED','CHUCKLED','TITTERED','SNICKERED','SPLATTED',
    'SPLISHED','SPLOSHED','SPLATTERED','CRASHED','BONKED','WHAMMED',
    'KAPOW','KABOOM','WHOOSH','SPLAT','ZAP','BAM','ZING','CRASH',
    'BONK','WHAM','SPLISH','SPLOSH','BLOOP','BZZZT','KERPLUNK',
    'ALKA-SELTZER','BAMBOOZLE','SHENANIGANS','HULLABALOO','RUCKUS',
    'RUMPUS','HOOPLA','FOFRARAW','GOBBLEDYGOOK','MUMBOJUMBO',
  ];

  function detectTheme(word) {
    const upper = word.toUpperCase().trim();
    for (const [theme, data] of Object.entries(THEMES)) {
      if (data.words.includes(upper)) {
        return { theme, ...data };
      }
    }
    return null;
  }

  function isSilly(word) {
    return SILLY_WORDS.includes(word.toUpperCase().trim());
  }

  // ══════════════════════════════════════════
  //  SCORING
  // ══════════════════════════════════════════
  function calculatePoints(word) {
    let points = 0;
    let reasons = [];

    // Base: 1 point per letter (min 2, max 8)
    points = Math.min(Math.max(word.length, 2), 8);
    reasons.push('+' + points);

    // Theme bonus
    const theme = detectTheme(word);
    if (theme) {
      points += theme.bonus;
      reasons.push(theme.label + ' +' + theme.bonus);
    }

    // Silly bonus
    if (isSilly(word)) {
      points += 3;
      reasons.push('Silly +3');
    }

    // Length bonus: 6+ letters
    if (word.length >= 6) {
      points += 2;
      reasons.push('Long +2');
    }

    // Word of the day bonus
    const wotd = getWotd();
    if (word.toUpperCase() === wotd.word) {
      points += 10;
      reasons.push('WOTD +10');
    }

    return { points, reasons, theme };
  }

  function awardPoints(word) {
    const { points, reasons, theme } = calculatePoints(word);
    const player = players[currentPlayer];
    player.score += points;
    player.words.push({ word, points, reasons, theme });

    // Update score display
    if (is2P) {
      if (currentPlayer === 1) {
        p1Score.textContent = player.score;
      } else {
        p2Score.textContent = player.score;
      }
      updateLeaderboard();
    }

    // Show points popup
    showPointsPopup(points, reasons, theme);

    // Play appropriate sound
    if (points >= 12) {
      playFanfare();
    } else {
      playPop();
    }

    return points;
  }

  function showPointsPopup(points, reasons, theme) {
    pointsPopup.innerHTML = '';
    const main = document.createElement('div');
    main.className = 'points-main';
    main.textContent = '+' + points;
    pointsPopup.appendChild(main);

    if (reasons.length > 1) {
      const detail = document.createElement('div');
      detail.className = 'points-detail';
      detail.textContent = reasons.join(' | ');
      pointsPopup.appendChild(detail);
    }

    if (theme) {
      const badge = document.createElement('div');
      badge.className = 'points-badge';
      badge.innerHTML = theme.emoji + ' ' + theme.label + ' Bonus!';
      pointsPopup.appendChild(badge);
    }

    pointsPopup.classList.remove('show');
    void pointsPopup.offsetWidth; // reflow
    pointsPopup.classList.add('show');
    setTimeout(() => pointsPopup.classList.remove('show'), 2000);
  }

  // ══════════════════════════════════════════
  //  LEADERBOARD
  // ══════════════════════════════════════════
  function updateLeaderboard() {
    leaderboardEntries.innerHTML = '';

    const sorted = [players[1], players[2]].sort((a, b) => b.score - a.score);

    sorted.forEach((p, i) => {
      const entry = document.createElement('div');
      entry.className = 'lb-entry' + (i === 0 ? ' lb-leading' : '');

      const medal = i === 0 ? '&#127942;' : (i === 1 ? '&#129352;' : '');
      entry.innerHTML = `
        <span class="lb-medal">${medal}</span>
        <span class="lb-name" style="color:${p.color}">${p.name}</span>
        <span class="lb-score">${p.score} pts</span>
        <span class="lb-words">${p.words.length} words</span>
      `;
      leaderboardEntries.appendChild(entry);
    });

    // Show best word
    const allWords = [...players[1].words, ...players[2].words];
    if (allWords.length > 0) {
      const best = allWords.reduce((a, b) => a.points > b.points ? a : b);
      const bestEntry = document.createElement('div');
      bestEntry.className = 'lb-best';
      bestEntry.innerHTML = `&#11088; Best word: <strong>"${best.word}"</strong> (+${best.points})`;
      leaderboardEntries.appendChild(bestEntry);
    }
  }

  // ══════════════════════════════════════════
  //  SOUND EFFECTS
  // ══════════════════════════════════════════
  let audioCtx = null;

  function getAudioCtx() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return audioCtx;
  }

  function playTone(freq, dur, type, vol, ramp) {
    try {
      const ctx = getAudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      if (ramp) osc.frequency.exponentialRampToValueAtTime(ramp, ctx.currentTime + dur);
      gain.gain.setValueAtTime(vol || 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + dur);
    } catch (e) {}
  }

  function playPop() {
    playTone(880, 0.12, 'sine', 0.18);
    setTimeout(() => playTone(1320, 0.1, 'sine', 0.12), 60);
    setTimeout(() => playTone(1760, 0.08, 'sine', 0.08), 110);
  }

  function playGiggle() {
    for (let i = 0; i < 4; i++) setTimeout(() => playTone(600 + i * 120, 0.08, 'sine', 0.1), i * 70);
  }

  function playBoing() {
    playTone(250, 0.25, 'sine', 0.15, 800);
    setTimeout(() => playTone(400, 0.15, 'sine', 0.1, 600), 80);
  }

  function playWhoosh() {
    try {
      const ctx = getAudioCtx();
      const buf = ctx.createBuffer(1, ctx.sampleRate * 0.3, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      const n = ctx.createBufferSource(); n.buffer = buf;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass';
      f.frequency.setValueAtTime(2000, ctx.currentTime);
      f.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.3); f.Q.value = 0.5;
      const g = ctx.createGain(); g.gain.setValueAtTime(0.2, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      n.connect(f); f.connect(g); g.connect(ctx.destination);
      n.start(); n.stop(ctx.currentTime + 0.3);
    } catch (e) {}
  }

  function playFanfare() {
    [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => playTone(f, 0.2, 'sine', 0.12), i * 100));
  }

  function playTurnSwitch() {
    playTone(440, 0.1, 'triangle', 0.1);
    setTimeout(() => playTone(660, 0.15, 'triangle', 0.08), 80);
  }

  // ══════════════════════════════════════════
  //  CATEGORIES — Rotating prompts
  // ══════════════════════════════════════════
  const CATEGORIES = [
    { emoji: '&#129315;', text: 'Type something silly!' },
    { emoji: '&#128062;', text: 'Type an animal!' },
    { emoji: '&#127843;', text: 'Type a food!' },
    { emoji: '&#127912;', text: 'Type a color!' },
    { emoji: '&#127925;', text: 'Type a song or sound!' },
    { emoji: '&#9917;', text: 'Type a sport!' },
    { emoji: '&#128302;', text: 'Type something magical!' },
    { emoji: '&#127775;', text: 'Type something shiny!' },
    { emoji: '&#128640;', text: 'Type something fast!' },
    { emoji: '&#127803;', text: 'Type a plant or flower!' },
    { emoji: '&#128187;', text: 'Type a game or toy!' },
    { emoji: '&#127752;', text: 'Type a weather word!' },
    { emoji: '&#128085;', text: 'Type something you wear!' },
    { emoji: '&#128176;', text: 'Type something sparkly!' },
    { emoji: '&#129668;', text: 'Type a place!' },
    { emoji: '&#128049;', text: 'Type something purrfect!' },
    { emoji: '&#127880;', text: 'Type a party word!' },
    { emoji: '&#128168;', text: 'Type something that flies!' },
  ];
  let categoryIndex = 0;

  function rotateCategory() {
    const cat = CATEGORIES[categoryIndex % CATEGORIES.length];
    categoryEmoji.style.opacity = '0';
    categoryText.style.opacity = '0';
    categoryText.style.transform = 'translateY(6px)';
    setTimeout(() => {
      categoryEmoji.innerHTML = cat.emoji;
      categoryText.textContent = cat.text;
      categoryEmoji.style.opacity = '1';
      categoryText.style.opacity = '1';
      categoryText.style.transform = 'translateY(0)';
    }, 300);
    categoryIndex++;
  }
  setInterval(rotateCategory, 8000);
  rotateCategory();

  // ══════════════════════════════════════════
  //  SURPRISE ME
  // ══════════════════════════════════════════
  const FUNNY_WORDS = [
    'WOBBLE','BOING','SQUISH','GOBBLE','FLIBBERT','SNOZZLE',
    'WOMBAT','BUBBLES','Noodles','SPROCKET','KAZOO','PLOPPER',
    'SNICKLE','FUZZBUCKET','WHOMPUS','ZIPPITY','DOODLEBUG',
    'PENGUIN','NARWHAL','PLATYPUS','AXOLOTL','QUOKKA',
    'PANGOLIN','CASSOWARY','WOLVERINE','CAPYBARA','FENNEC',
    'SPAGHETTI','WAFFLE','BURRITO','DUMPLING','PRETZEL',
    'PANCAKE','CUPCAKE','JELLO','PIZZA','TACO',
    'DRAGON','UNICORN','PHOENIX','GOBLIN','WIZARD',
    'MERMAID','TROLL','FAIRY','SPHINX','GARGOYLE',
    'THUNDER','VOLCANO','TSUNAMI','AURORA','GLACIER',
    'KABOOM','ZAP','WHOOSH','KAPOW','SPLAT',
    'BONK','WHAM','ZING','CRASH','BLOOP',
    'JUNGLE','DESERT','OCEAN','TUNDRA','CANYON',
  ];

  function surpriseMe() {
    wordInput.value = pickRandom(FUNNY_WORDS);
    wordInput.focus();
    surpriseBtn.classList.add('surprise-spin');
    setTimeout(() => surpriseBtn.classList.remove('surprise-spin'), 600);
    playBoing();
  }

  // ══════════════════════════════════════════
  //  WORD OF THE DAY
  // ══════════════════════════════════════════
  const WOTD_LIST = [
    { word: 'PYRAMID', landmark: 'Chichen Itza', hint: 'Ancient Maya wonder!', icon: '&#127951;' },
    { word: 'DOME', landmark: 'Taj Mahal', hint: 'The famous white dome!', icon: '&#127963;' },
    { word: 'WALL', landmark: 'Great Wall', hint: 'Longest wall on Earth!', icon: '&#127984;' },
    { word: 'STATUE', landmark: 'Christ Redeemer', hint: 'Arms wide open!', icon: '&#128588;' },
    { word: 'TEMPLE', landmark: 'Petra', hint: 'Carved into pink rock!', icon: '&#127951;' },
    { word: 'ARENA', landmark: 'Colosseum', hint: 'Where gladiators fought!', icon: '&#127951;' },
    { word: 'MOUNTAIN', landmark: 'Machu Picchu', hint: 'High in the Andes!', icon: '&#9968;' },
    { word: 'LLAMA', landmark: 'Machu Picchu', hint: 'Furry Andes friend!', icon: '&#129444;' },
    { word: 'RUBY', landmark: 'Petra', hint: 'Rose-red city!', icon: '&#127951;' },
    { word: 'SKY', landmark: 'Christ Redeemer', hint: 'Arms touch the clouds!', icon: '&#128588;' },
  ];

  function getWotd() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return WOTD_LIST[seed % WOTD_LIST.length];
  }

  function initWotd() {
    const wotd = getWotd();
    wotdWord.innerHTML = wotd.icon + ' ' + wotd.word;
    wotdHint.textContent = wotd.hint;
  }

  function claimWotd() {
    wordInput.value = getWotd().word;
    wordInput.focus();
    playPop();
    wotdBanner.classList.add('wotd-flash');
    setTimeout(() => wotdBanner.classList.remove('wotd-flash'), 600);
  }

  initWotd();

  // ══════════════════════════════════════════
  //  MODE SELECTION
  // ══════════════════════════════════════════
  modeSolo.addEventListener('click', () => {
    is2P = false;
    startGame();
  });

  modeDuo.addEventListener('click', () => {
    modeSolo.style.display = 'none';
    modeDuo.style.display = 'none';
    playerSetup.style.display = 'block';
    p1NameInput.focus();
  });

  modeGo.addEventListener('click', () => {
    is2P = true;
    players[1].name = p1NameInput.value.trim() || 'Player 1';
    players[2].name = p2NameInput.value.trim() || 'Player 2';
    startGame();
  });

  // Allow Enter to start from name inputs
  [p1NameInput, p2NameInput].forEach(input => {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        modeGo.click();
      }
    });
  });

  function startGame() {
    modeScreen.style.display = 'none';
    wordPanel.style.display = 'flex';

    if (is2P) {
      turnBar.style.display = 'flex';
      activeTurn.style.display = 'flex';
      leaderboard.style.display = 'block';
      p1TagName.textContent = players[1].name;
      p2TagName.textContent = players[2].name;
      p1Score.textContent = '0';
      p2Score.textContent = '0';
      currentPlayer = 1;
      updateTurnIndicator();
      updateLeaderboard();
    }

    wordInput.focus();
    playPop();
  }

  // ══════════════════════════════════════════
  //  TURN MANAGEMENT
  // ══════════════════════════════════════════
  function updateTurnIndicator() {
    if (!is2P) return;

    activeTurnName.textContent = players[currentPlayer].name;
    activeTurnName.style.color = players[currentPlayer].color;

    p1Tag.classList.toggle('active-player', currentPlayer === 1);
    p2Tag.classList.toggle('active-player', currentPlayer === 2);

    // Update input placeholder
    wordInput.placeholder = players[currentPlayer].name + ', type here...';
  }

  function switchTurn() {
    if (!is2P) return;
    turnCount++;
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    updateTurnIndicator();
    playTurnSwitch();
  }

  // ══════════════════════════════════════════
  //  LANDMARK REACTIONS
  // ══════════════════════════════════════════
  const LANDMARKS = [
    { x: 10, y: 35, reactions: ['&#128516;','&#128514;','&#129315;','&#128513;','&#128515;'] },
    { x: 22, y: 40, reactions: ['&#128562;','&#128560;','&#128565;','&#129321;','&#128564;'] },
    { x: 38, y: 25, reactions: ['&#127881;','&#128526;','&#129321;','&#128522;','&#129721;'] },
    { x: 52, y: 50, reactions: ['&#129444;','&#128526;','&#129297;','&#128540;','&#129321;'] },
    { x: 62, y: 30, reactions: ['&#129299;','&#128514;','&#129315;','&#128518;','&#129316;'] },
    { x: 75, y: 38, reactions: ['&#128556;','&#128568;&#128170;','&#129682;','&#129315;','&#128540;'] },
    { x: 90, y: 35, reactions: ['&#129392;','&#128525;','&#128522;','&#128513;','&#127881;'] },
  ];

  function spawnLandmarkReaction() {
    const lm = pickRandom(LANDMARKS);
    const reaction = pickRandom(lm.reactions);
    const el = document.createElement('div');
    el.className = 'landmark-reaction';
    el.innerHTML = reaction;
    el.style.left = lm.x + '%';
    el.style.top = lm.y + '%';
    gameWorld.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 1800);
  }

  // ══════════════════════════════════════════
  //  MILESTONE CONFETTI
  // ══════════════════════════════════════════
  function checkMilestone() {
    if (wordCount > 0 && wordCount % 5 === 0) {
      spawnMilestoneConfetti();
      playFanfare();
      showMilestoneToast();
    }
  }

  function spawnMilestoneConfetti() {
    const colors = ['#FF7EB3','#FF4D6D','#FFD66B','#7EDECC','#C4A8E8','#FFAB76','#93D5ED','#FF5C6A','#FFFFFF'];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight / 3;

    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = cx + 'px';
      piece.style.top = cy + 'px';
      piece.style.background = pickRandom(colors);
      const angle = (Math.PI * 2 * i) / 60 + rand(-0.3, 0.3);
      const dist = rand(100, 280);
      piece.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      piece.style.setProperty('--ty', (Math.sin(angle) * dist - rand(50, 150)) + 'px');
      piece.style.setProperty('--rot', rand(180, 900) + 'deg');
      piece.style.setProperty('--dur', rand(1.2, 2.2) + 's');
      const size = rand(6, 14);
      piece.style.width = size + 'px';
      piece.style.height = size + 'px';
      const shape = Math.random();
      if (shape < 0.4) piece.style.borderRadius = '50%';
      else if (shape < 0.7) piece.style.borderRadius = '2px';
      else piece.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 2500);
    }

    for (let r = 0; r < 3; r++) {
      setTimeout(() => {
        const ring = document.createElement('div');
        ring.className = 'sparkle-ring';
        ring.style.left = cx + 'px';
        ring.style.top = cy + 'px';
        ring.style.borderColor = pickRandom(colors);
        ring.style.animationDuration = (0.7 + r * 0.15) + 's';
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 1000);
      }, r * 150);
    }
  }

  function showMilestoneToast() {
    const existing = document.querySelector('.milestone-toast');
    if (existing) existing.remove();
    const el = document.createElement('div');
    el.className = 'milestone-toast';
    el.innerHTML = '&#127881; ' + wordCount + ' Words Typed! &#127881;';
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('fade-out'); setTimeout(() => el.remove(), 600); }, 2500);
  }

  // ══════════════════════════════════════════
  //  ADD WORD AS CHIP
  // ══════════════════════════════════════════
  function addWord() {
    const text = wordInput.value.trim();
    if (!text) return;
    if (text.length > 20) return;

    emptyHint.style.display = 'none';
    wordCount++;

    // Award points
    const pts = awardPoints(text);

    // Effects
    spawnLandmarkReaction();
    checkMilestone();
    incrementStreak();

    if (placedCount < 20) {
      // AUTO-PLACE at next sequential target
      let target;
      if (placedCount < 10) {
        // Stage 1: Main image numbered markers
        target = mainTargets[placedCount];
      } else {
        // Stage 2: Bottom information cards
        target = bottomTargets[placedCount - 10];
      }
      placeWordAtTarget(text, nextChipColor(), target.x, target.y, placedCount);
      placedCount++;
    } else {
      // FREE PLACEMENT — create chip in panel (existing behavior)
      const chip = document.createElement('div');
      chip.className = 'word-chip ' + nextChipColor();
      chip.dataset.word = text;

      if (is2P) {
        chip.style.borderLeft = '4px solid ' + players[currentPlayer].color;
      }

      const textSpan = document.createElement('span');
      textSpan.className = 'chip-text';
      textSpan.textContent = text.toUpperCase();

      const delBtn = document.createElement('button');
      delBtn.className = 'chip-delete';
      delBtn.innerHTML = '&#10005;';
      delBtn.title = 'Remove';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chip.style.transform = 'scale(0.3) rotate(12deg)';
        chip.style.opacity = '0';
        setTimeout(() => chip.remove(), 300);
        setTimeout(() => {
          if (chipArea.querySelectorAll('.word-chip').length <= 1) emptyHint.style.display = '';
        }, 50);
      });

      chip.appendChild(textSpan);
      chip.appendChild(delBtn);
      makeChipDraggable(chip, text);
      chipArea.insertBefore(chip, emptyHint);
    }

    wordInput.value = '';
    wordInput.focus();

    // Switch turn in 2P mode
    if (is2P) {
      switchTurn();
    }
  }

  // ══════════════════════════════════════════
  //  DRAG CHIP FROM PANEL TO BACKGROUND
  // ══════════════════════════════════════════
  function makeChipDraggable(chip, wordText) {
    let isDragging = false;
    let ghost = null;
    let offsetX, offsetY;

    function onPointerDown(e) {
      if (e.target.classList.contains('chip-delete')) return;
      e.preventDefault();
      isDragging = true;
      const rect = chip.getBoundingClientRect();
      const cx = e.clientX || e.touches?.[0]?.clientX || 0;
      const cy = e.clientY || e.touches?.[0]?.clientY || 0;
      offsetX = cx - rect.left;
      offsetY = cy - rect.top;
      ghost = chip.cloneNode(true);
      ghost.classList.add('drag-ghost');
      ghost.style.width = rect.width + 'px';
      ghost.style.left = (cx - offsetX) + 'px';
      ghost.style.top = (cy - offsetY) + 'px';
      document.body.appendChild(ghost);
      chip.style.opacity = '0.3';
      chip.style.transform = 'scale(0.9)';
    }

    function onPointerMove(e) {
      if (!isDragging || !ghost) return;
      e.preventDefault();
      const cx = e.clientX || e.touches?.[0]?.clientX || 0;
      const cy = e.clientY || e.touches?.[0]?.clientY || 0;
      ghost.style.left = (cx - offsetX) + 'px';
      ghost.style.top = (cy - offsetY) + 'px';
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      const cx = e.clientX || e.changedTouches?.[0]?.clientX || 0;
      const cy = e.clientY || e.changedTouches?.[0]?.clientY || 0;
      if (ghost) { ghost.remove(); ghost = null; }
      chip.classList.add('snapping');
      chip.style.opacity = '';
      chip.style.transform = '';
      setTimeout(() => chip.classList.remove('snapping'), 400);
      const panelEl = document.querySelector('.word-panel');
      const pr = panelEl.getBoundingClientRect();
      const onPanel = cx >= pr.left && cx <= pr.right && cy >= pr.top && cy <= pr.bottom;
      if (!onPanel && cx > 0 && cy > 0) {
        placeWordOnBackground(wordText, getChipColor(chip), cx, cy);
      }
    }

    chip.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    chip.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    document.addEventListener('touchend', onPointerUp, { passive: false });
  }

  function getChipColor(chip) {
    for (const c of CHIP_COLORS) { if (chip.classList.contains(c)) return c; }
    return 'chip-coral';
  }

  // ══════════════════════════════════════════
  //  PLACE WORD ON BACKGROUND
  // ══════════════════════════════════════════
  function placeWordOnBackground(text, colorClass, clientX, clientY) {
    const worldRect = gameWorld.getBoundingClientRect();
    const x = clientX - worldRect.left;
    const y = clientY - worldRect.top;

    playGiggle();
    setTimeout(playBoing, 100);
    spawnLandmarkReaction();
    incrementStreak();

    const el = document.createElement('div');
    el.className = 'placed-word ' + colorClass;
    el.textContent = text.toUpperCase();
    el.style.left = x + 'px';
    el.style.top = y + 'px';

    const delBtn = document.createElement('button');
    delBtn.className = 'placed-delete';
    delBtn.innerHTML = '&#10005;';
    delBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      el.style.transform = 'scale(0.2) rotate(15deg)';
      el.style.opacity = '0';
      setTimeout(() => el.remove(), 300);
      const idx = placedWords.indexOf(el);
      if (idx > -1) placedWords.splice(idx, 1);
    });
    el.appendChild(delBtn);

    gameWorld.appendChild(el);
    placedWords.push(el);
    makePlacedWordDraggable(el);
    spawnSparkleBurst(clientX, clientY);
  }

  // ══════════════════════════════════════════
  //  PLACE WORD AT TARGET (Sequential Auto-Place)
  // ══════════════════════════════════════════
  function placeWordAtTarget(text, colorClass, x, y, targetIndex) {
    playGiggle();
    setTimeout(playBoing, 100);
    spawnLandmarkReaction();
    incrementStreak();

    // Use actual image dimensions if loaded, fallback to measured ratio
    let srcW, srcH;
    if (imgNaturalW && imgNaturalH) {
      srcW = imgNaturalW;
      srcH = imgNaturalH;
    } else {
      srcW = 900;
      srcH = 560;
    }
    const srcRatio = srcW / srcH;

    // Calculate actual visible image dimensions within the game-world container
    const worldRect = gameWorld.getBoundingClientRect();
    const viewRatio = worldRect.width / worldRect.height;

    let imgW, imgH;
    if (viewRatio > srcRatio) {
      // Viewport is wider — image height fills the container
      imgH = worldRect.height;
      imgW = imgH * srcRatio;
    } else {
      // Viewport is taller — image width fills the container
      imgW = worldRect.width;
      imgH = imgW / srcRatio;
    }

    // Image offset within the game-world container (centered)
    const imgLeft = (worldRect.width - imgW) / 2;
    const imgTop = (worldRect.height - imgH) / 2;

    // Convert image-relative percentages to game-world pixels
    // Then center the 70x70 word element on the target point
    const HALF = 35;
    const pixelX = imgLeft + (x / 100) * imgW - HALF;
    const pixelY = imgTop + (y / 100) * imgH - HALF;

    const el = document.createElement('div');
    el.className = 'placed-word ' + colorClass;
    el.textContent = text.toUpperCase();
    el.dataset.targetIndex = targetIndex;
    el.dataset.wordNumber = placedCount + 1;

    // Start from center of screen
    el.style.left = (window.innerWidth / 2 - HALF) + 'px';
    el.style.top = (window.innerHeight / 2 - HALF) + 'px';
    el.style.opacity = '0';
    el.style.transform = 'scale(0.3)';
    el.style.zIndex = '20';

    gameWorld.appendChild(el);
    placedWords.push(el);

    // Animate to target position
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = 'left 0.6s cubic-bezier(0.34,1.56,0.64,1), top 0.6s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
        el.style.left = pixelX + 'px';
        el.style.top = pixelY + 'px';
        el.style.opacity = '1';
        el.style.transform = 'scale(1)';
      });
    });

    // After animation, lock the word
    setTimeout(() => {
      el.classList.add('locked');
      el.style.transition = '';
      el.style.pointerEvents = 'none';

      // Sparkle burst at target
      spawnSparkleBurst(worldRect.left + pixelX + HALF, worldRect.top + pixelY + HALF);
    }, 650);

    // Delete button (hidden since locked, but kept for consistency)
    const delBtn = document.createElement('button');
    delBtn.className = 'placed-delete';
    delBtn.innerHTML = '&#10005;';
    el.appendChild(delBtn);
  }

  // ══════════════════════════════════════════
  //  MAKE PLACED WORD DRAGGABLE
  // ══════════════════════════════════════════
  function makePlacedWordDraggable(el) {
    let isDragging = false;
    let startX, startY, origLeft, origTop;

    function onPointerDown(e) {
      if (el.classList.contains('locked')) return;
      if (e.target.classList.contains('placed-delete')) return;
      e.preventDefault();
      e.stopPropagation();
      isDragging = true;
      el.classList.add('dragging');
      const t = e.touches ? e.touches[0] : e;
      startX = t.clientX; startY = t.clientY;
      origLeft = parseFloat(el.style.left) || 0;
      origTop = parseFloat(el.style.top) || 0;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      e.preventDefault();
      const t = e.touches ? e.touches[0] : e;
      el.style.left = (origLeft + t.clientX - startX) + 'px';
      el.style.top = (origTop + t.clientY - startY) + 'px';
    }

    function onPointerUp(e) {
      if (!isDragging) return;
      isDragging = false;
      el.classList.remove('dragging');
    }

    el.addEventListener('mousedown', onPointerDown);
    document.addEventListener('mousemove', onPointerMove);
    document.addEventListener('mouseup', onPointerUp);
    el.addEventListener('touchstart', onPointerDown, { passive: false });
    document.addEventListener('touchmove', onPointerMove, { passive: false });
    el.addEventListener('touchend', onPointerUp, { passive: false });
  }

  // ══════════════════════════════════════════
  //  SPARKLE BURST
  // ══════════════════════════════════════════
  const SPARKLE_COLORS = ['#FFD66B','#FF7E8A','#FFAB76','#C4A8E8','#7EDECC','#93D5ED','#FFB5A7','#FFFFFF'];

  function spawnSparkleBurst(cx, cy) {
    for (let i = 0; i < 14; i++) {
      const el = document.createElement('div');
      el.className = 'sparkle';
      const angle = (Math.PI * 2 * i) / 14 + rand(-0.25, 0.25);
      const dist = rand(30, 65);
      el.style.left = cx + 'px'; el.style.top = cy + 'px';
      el.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
      el.style.setProperty('--ty', Math.sin(angle) * dist + 'px');
      el.style.setProperty('--dur', rand(0.5, 0.85) + 's');
      el.style.setProperty('--rot', rand(180, 720) + 'deg');
      const size = rand(5, 10);
      el.style.width = size + 'px'; el.style.height = size + 'px';
      const shape = Math.random();
      if (shape < 0.5) el.style.borderRadius = '50%';
      else if (shape < 0.75) el.style.borderRadius = '3px';
      else el.style.clipPath = 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)';
      el.style.background = pickRandom(SPARKLE_COLORS);
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 1000);
    }

    const ring = document.createElement('div');
    ring.className = 'sparkle-ring';
    ring.style.left = cx + 'px'; ring.style.top = cy + 'px';
    ring.style.borderColor = pickRandom(SPARKLE_COLORS);
    document.body.appendChild(ring);
    setTimeout(() => ring.remove(), 700);

    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = (cx + rand(-16, 16)) + 'px';
        s.style.top = (cy + rand(-8, 8)) + 'px';
        s.style.setProperty('--tx', rand(-25, 25) + 'px');
        s.style.setProperty('--ty', rand(-55, -15) + 'px');
        s.style.setProperty('--dur', rand(0.8, 1.2) + 's');
        s.style.setProperty('--rot', rand(90, 360) + 'deg');
        const sz = rand(4, 7);
        s.style.width = sz + 'px'; s.style.height = sz + 'px';
        s.style.borderRadius = '50%';
        s.style.background = '#FFD66B';
        s.style.boxShadow = '0 0 6px 2px rgba(255,214,107,0.5)';
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1300);
      }, i * 55);
    }
  }

  // ══════════════════════════════════════════
  //  IDLE ANIMATIONS — Keep the scene alive
  // ══════════════════════════════════════════
  const IDLE_CLASSES = ['idle-bounce', 'idle-wiggle', 'idle-float'];

  function animateRandomPlacedWord() {
    if (placedWords.length === 0) return;
    const el = pickRandom(placedWords);
    const cls = pickRandom(IDLE_CLASSES);
    el.classList.remove(...IDLE_CLASSES);
    void el.offsetWidth;
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  }

  function animateRandomLandmark() {
    const lm = pickRandom(LANDMARKS);
    const reaction = pickRandom(lm.reactions);
    const el = document.createElement('div');
    el.className = 'landmark-reaction';
    el.innerHTML = reaction;
    el.style.left = lm.x + '%';
    el.style.top = lm.y + '%';
    gameWorld.appendChild(el);
    requestAnimationFrame(() => el.classList.add('show'));
    setTimeout(() => { el.classList.remove('show'); setTimeout(() => el.remove(), 500); }, 1800);
  }

  // Every 4-7 seconds, animate a random element
  function scheduleIdleAnimation() {
    const delay = rand(4000, 7000);
    setTimeout(() => {
      if (placedWords.length > 0 && Math.random() < 0.6) {
        animateRandomPlacedWord();
      }
      if (Math.random() < 0.3) {
        animateRandomLandmark();
      }
      scheduleIdleAnimation();
    }, delay);
  }
  scheduleIdleAnimation();

  // ══════════════════════════════════════════
  //  STREAK COUNTER — Dopamine hit
  // ══════════════════════════════════════════
  function incrementStreak() {
    streakCount++;
    checkStreakMilestone();
  }

  function checkStreakMilestone() {
    for (let i = STREAK_MESSAGES.length - 1; i >= 0; i--) {
      const m = STREAK_MESSAGES[i];
      if (streakCount >= m.min && lastStreakMilestone < m.min) {
        lastStreakMilestone = m.min;
        showStreakMessage(m.text.replace('{emoji}', m.emoji), m.emoji);
        return;
      }
    }
  }

  function showStreakMessage(text, emoji) {
    streakCounter.innerHTML = `<span class="streak-fire">${emoji}</span> ${text}`;
    streakCounter.classList.add('visible');
    streakCounter.classList.remove('bump');
    void streakCounter.offsetWidth;
    streakCounter.classList.add('bump');
    playFanfare();

    clearTimeout(streakTimeout);
    streakTimeout = setTimeout(() => {
      streakCounter.classList.remove('visible');
    }, 3500);
  }

  // ══════════════════════════════════════════
  //  RESET
  // ══════════════════════════════════════════
  function resetAll() {
    playWhoosh();
    placedWords.forEach((el, i) => {
      setTimeout(() => {
        el.style.transform = 'scale(0.2) rotate(-20deg)';
        el.style.opacity = '0';
        setTimeout(() => el.remove(), 300);
      }, i * 40);
    });
    placedWords.length = 0;
    placedCount = 0;

    // Reset streak
    streakCount = 0;
    lastStreakMilestone = 0;
    clearTimeout(streakTimeout);
    streakCounter.classList.remove('visible');
  }

  // ── Event listeners ──
  addBtn.addEventListener('click', addWord);
  surpriseBtn.addEventListener('click', surpriseMe);
  wotdClaim.addEventListener('click', claimWotd);
  resetBtn.addEventListener('click', resetAll);

  wordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); addWord(); }
  });

  toast.addEventListener('animationend', (e) => {
    if (e.animationName === 'toastOut') toast.style.display = 'none';
  });

})();
