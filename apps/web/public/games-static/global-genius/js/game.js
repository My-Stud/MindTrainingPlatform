/* ===== WORLD EXPLORER ADVENTURE — MULTI-STAGE GAME LOGIC ===== */

let stars = 0;
let matched = 0;
let selectedCard = null;
let currentBatch = 0;
let batches = [];
let isTransitioning = false;
let currentStage = null;
let currentCountries = [];
let gameMode = 'stage'; /* 'stage' or 'quiz' */
let quizQuestions = [];
let quizIndex = 0;
let quizScore = 0;

/* stage definitions */
const STAGES = [
  {id:'asia', name:'Asia', emoji:'🌏', description:'21 Countries', data:()=>typeof COUNTRIES !== 'undefined' ? COUNTRIES : []},
  {id:'europe', name:'Europe', emoji:'🌍', description:'12 Countries', data:()=>typeof EUROPE_COUNTRIES !== 'undefined' ? EUROPE_COUNTRIES : []},
  {id:'africa', name:'Africa', emoji:'🌍', description:'12 Countries', data:()=>typeof AFRICA_COUNTRIES !== 'undefined' ? AFRICA_COUNTRIES : []},
  {id:'quiz', name:'Quiz', emoji:'🧠', description:'Test Yourself', data:()=>[]},
];

/* ===== SOUND SYSTEM (Web Audio API) ===== */
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function ensureAudio(){
  if(!audioCtx) audioCtx = new AudioCtx();
  if(audioCtx.state === 'suspended') audioCtx.resume();
}

function playSound(type){
  try { ensureAudio(); } catch(e){ return; }
  const now = audioCtx.currentTime;

  switch(type){
    case 'pop': {
      const osc = audioCtx.createOscillator();
      osc.type='sine'; osc.frequency.value=600;
      osc.frequency.exponentialRampToValueAtTime(900, now+0.08);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.12);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.15);
      break;
    }
    case 'whoosh': {
      const dur = 0.25;
      const bufSize = audioCtx.sampleRate * dur;
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<bufSize;i++) data[i] = (Math.random()*2-1) * (1-i/bufSize);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const filt = audioCtx.createBiquadFilter();
      filt.type='bandpass'; filt.frequency.value=1200; filt.Q.value=0.5;
      filt.frequency.setValueAtTime(2000, now);
      filt.frequency.exponentialRampToValueAtTime(500, now+dur);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+dur);
      src.connect(filt).connect(gain).connect(audioCtx.destination);
      src.start(now); src.stop(now+dur);
      break;
    }
    case 'sparkle': {
      [1600,2200,3000,3600].forEach((freq,i)=>{
        const osc = audioCtx.createOscillator();
        osc.type='sine'; osc.frequency.value=freq;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now+i*0.05);
        gain.gain.linearRampToValueAtTime(0.07, now+i*0.05+0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now+i*0.05+0.35);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now+i*0.05); osc.stop(now+i*0.05+0.4);
      });
      break;
    }
    case 'clink': {
      const osc = audioCtx.createOscillator();
      osc.type='sine'; osc.frequency.value=2800;
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.12);
      break;
    }
    case 'woodClick': {
      const dur = 0.06;
      const bufSize = audioCtx.sampleRate * dur;
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<bufSize;i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/bufSize, 2);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const filt = audioCtx.createBiquadFilter();
      filt.type='lowpass'; filt.frequency.value=800;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.15;
      src.connect(filt).connect(gain).connect(audioCtx.destination);
      src.start(now); src.stop(now+dur);
      break;
    }
    case 'click': {
      const dur = 0.04;
      const bufSize = audioCtx.sampleRate * dur;
      const buf = audioCtx.createBuffer(1, bufSize, audioCtx.sampleRate);
      const data = buf.getChannelData(0);
      for(let i=0;i<bufSize;i++) data[i] = (Math.random()*2-1) * Math.pow(1-i/bufSize, 3);
      const src = audioCtx.createBufferSource();
      src.buffer = buf;
      const gain = audioCtx.createGain();
      gain.gain.value = 0.18;
      src.connect(gain).connect(audioCtx.destination);
      src.start(now); src.stop(now+dur);
      break;
    }
    case 'tada': {
      const notes = [523, 659, 784, 1047];
      notes.forEach((freq,i)=>{
        const osc = audioCtx.createOscillator();
        osc.type='triangle'; osc.frequency.value=freq;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now+i*0.1);
        gain.gain.linearRampToValueAtTime(0.09, now+i*0.1+0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now+i*0.1+0.45);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now+i*0.1); osc.stop(now+i*0.1+0.5);
      });
      break;
    }
    case 'wrong': {
      const osc = audioCtx.createOscillator();
      osc.type='triangle'; osc.frequency.value=220;
      osc.frequency.exponentialRampToValueAtTime(150, now+0.2);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.07, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.25);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.3);
      break;
    }
    case 'correct': {
      const osc = audioCtx.createOscillator();
      osc.type='sine'; osc.frequency.value=880;
      osc.frequency.exponentialRampToValueAtTime(1320, now+0.15);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.3);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.35);
      break;
    }
  }
}

/* ===== BUILD SCENERY (treasure room) ===== */
function buildScenery(){
  const wrap = document.getElementById('scenery');
  wrap.innerHTML = '';

  const wall = document.createElement('div');
  wall.className='wood-wall';
  wrap.appendChild(wall);

  const lanternPositions = [
    {left:'8%', top:'5%'},
    {left:'30%', top:'3%'},
    {left:'55%', top:'6%'},
    {left:'78%', top:'4%'},
    {left:'92%', top:'7%'},
  ];
  lanternPositions.forEach(pos=>{
    const lantern = document.createElement('div');
    lantern.className='lantern';
    lantern.style.left = pos.left;
    lantern.style.top = pos.top;
    lantern.innerHTML = `
      <div class="lantern-string"></div>
      <div class="lantern-body">
        <div class="lantern-glow"></div>
      </div>
    `;
    wrap.appendChild(lantern);
  });

  const chests = [
    {left:'5%', bottom:'15px', emoji:'🧰', size:'40px'},
    {left:'85%', bottom:'20px', emoji:'📦', size:'35px'},
  ];
  chests.forEach(c=>{
    const chest = document.createElement('div');
    chest.className='treasure-chest';
    chest.style.left = c.left;
    chest.style.bottom = c.bottom;
    chest.style.fontSize = c.size;
    chest.textContent = c.emoji;
    wrap.appendChild(chest);
  });

  const maps = [
    {left:'15%', top:'20%', rotate:'-5deg'},
    {left:'70%', top:'15%', rotate:'8deg'},
    {left:'88%', top:'25%', rotate:'-3deg'},
  ];
  maps.forEach(m=>{
    const map = document.createElement('div');
    map.className='wall-map';
    map.style.left = m.left;
    map.style.top = m.top;
    map.style.transform = `rotate(${m.rotate})`;
    wrap.appendChild(map);
  });

  const compass = document.createElement('div');
  compass.className='compass';
  compass.style.left = '45%';
  compass.style.top = '8%';
  compass.textContent = '🧭';
  wrap.appendChild(compass);

  for(let i=0; i<40; i++){
    const s = document.createElement('div');
    s.className='star' + (Math.random()>0.8?' lg':'');
    s.style.left = Math.random()*100+'%';
    s.style.top = Math.random()*50+'%';
    s.style.animationDelay = (Math.random()*5)+'s';
    s.style.animationDuration = (2+Math.random()*3)+'s';
    wrap.appendChild(s);
  }

  for(let i=0; i<6; i++){
    const f = document.createElement('div');
    f.className='firefly';
    f.style.left = (10+Math.random()*80)+'%';
    f.style.top = (40+Math.random()*50)+'%';
    f.style.animationDelay = (Math.random()*6)+'s';
    f.style.animationDuration = (6+Math.random()*6)+'s';
    wrap.appendChild(f);
  }

  for(let i=0; i<15; i++){
    const dust = document.createElement('div');
    dust.className='golden-dust';
    dust.style.left = (5+Math.random()*90)+'%';
    dust.style.top = (30+Math.random()*60)+'%';
    dust.style.animationDelay = (Math.random()*6)+'s';
    dust.style.animationDuration = (5+Math.random()*4)+'s';
    wrap.appendChild(dust);
  }

  startShootingStars(wrap);
}

function startShootingStars(wrap){
  function spawnStar(){
    const star = document.createElement('div');
    star.className='shooting-star';
    star.style.left = (5+Math.random()*60)+'%';
    star.style.top = (2+Math.random()*25)+'%';
    wrap.appendChild(star);
    setTimeout(()=>star.remove(), 800);
    setTimeout(spawnStar, 3000+Math.random()*5000);
  }
  setTimeout(spawnStar, 2000);
}

/* ===== SHUFFLE ===== */
function shuffled(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

/* ===== SPLIT INTO BATCHES ===== */
function buildBatches(){
  batches = [];
  for(let i = 0; i < currentCountries.length; i += BATCH_SIZE){
    batches.push(currentCountries.slice(i, i + BATCH_SIZE));
  }
}

/* ===== UPDATE HUD ===== */
function updateHUD(){
  document.getElementById('star-count').textContent = stars;
  document.getElementById('progress-label').textContent = `${matched} / ${currentCountries.length} matched`;
  document.getElementById('progress-bar').style.width = (matched / currentCountries.length * 100) + '%';
}

/* ===== BUILD JARS ===== */
function buildJars(){
  const jarsEl = document.getElementById('jars');
  jarsEl.innerHTML = '';
  const batch = batches[currentBatch];
  if(!batch) return;
  batch.forEach(c=>{
    const wrapEl = document.createElement('div');
    wrapEl.className='jar-wrap';

    const header = document.createElement('div');
    header.className='jar-header';
    header.innerHTML = `<span class="jar-flag">${c.flag}</span><span class="jar-name">${c.name}</span>`;

    const jar = document.createElement('div');
    jar.className='jar';
    jar.dataset.code = c.code;

    wrapEl.appendChild(header);
    wrapEl.appendChild(jar);
    jarsEl.appendChild(wrapEl);
  });
}

/* ===== BUILD TRAY ===== */
function buildTray(){
  const trayEl = document.getElementById('tray');
  trayEl.innerHTML = '';
  const batch = batches[currentBatch];
  if(!batch) return;
  shuffled(batch).forEach(c=>{
    const card = document.createElement('div');
    card.className='capital-card';
    card.dataset.code = c.code;
    card.innerHTML = `📍 ${c.capital}`;
    trayEl.appendChild(card);
  });
}

/* ===== ATTACH DRAG EVENTS ===== */
function attachDragEvents(){
  document.querySelectorAll('.capital-card').forEach(card=>{
    let isDragging = false;
    let startX, startY;

    card.addEventListener('pointerdown', (e)=>{
      card.setPointerCapture && card.setPointerCapture(e.pointerId);
      isDragging = false;
      startX = e.clientX;
      startY = e.clientY;
      onPointerDown(e);
    });

    card.addEventListener('pointermove', (e)=>{
      if(!dragCard) return;
      const dx = Math.abs(e.clientX - startX);
      const dy = Math.abs(e.clientY - startY);
      if(dx > 5 || dy > 5) isDragging = true;
      movePointer(e);
    });

    card.addEventListener('pointerup', (e)=>{
      if(isDragging){
        onPointerUp(e);
      } else {
        /* tap-to-select */
        ghost.style.display='none';
        dragCard = null;
        document.querySelectorAll('.jar').forEach(j=>j.classList.remove('dragover'));
        playSound('pop');
        document.querySelectorAll('.capital-card').forEach(c=>{
          c.classList.remove('selected');
          c.style.borderColor='transparent';
        });
        selectedCard = card;
        card.classList.add('selected');
        card.style.borderColor = 'var(--gold)';
      }
      isDragging = false;
    });

    card.addEventListener('pointercancel', (e)=>{
      ghost.style.display='none';
      dragCard = null;
      isDragging = false;
    });
  });
}

/* ===== ATTACH JAR CLICK EVENTS ===== */
function attachJarClicks(){
  document.querySelectorAll('.jar').forEach(jar=>{
    jar.addEventListener('click', ()=>{
      if(selectedCard && !isTransitioning && !jar.dataset.filled){
        const cardToDrop = selectedCard;
        selectedCard = null;
        document.querySelectorAll('.capital-card').forEach(c=>{
          c.classList.remove('selected');
          c.style.borderColor='transparent';
        });
        handleDrop(cardToDrop, jar);
      }
    });
  });
}

/* ===== LOAD CURRENT BATCH ===== */
function loadBatch(){
  isTransitioning = false;
  selectedCard = null;
  dragCard = null;
  ghost.style.display = 'none';
  buildJars();
  buildTray();
  attachDragEvents();
  attachJarClicks();
  const stageName = currentStage ? currentStage.name : 'Game';
  document.getElementById('subtitle').textContent =
    `Batch ${currentBatch + 1} of ${batches.length} — Place each capital into its jar`;
  removeFloatingHint();
  setTimeout(showFloatingHint, 400);
}

/* ===== START GAME ===== */
function startGame(){
  stars = 0;
  matched = 0;
  currentBatch = 0;
  selectedCard = null;
  isTransitioning = false;
  currentCountries = currentStage.data();
  buildBatches();
  buildScenery();
  updateHUD();
  loadBatch();
}

/* ===== DRAG & DROP ===== */
const ghost = document.getElementById('drag-ghost');
let dragCard = null;

function onPointerDown(e){
  const card = e.currentTarget;
  if(card.dataset.locked || isTransitioning) return;
  dragCard = card;
  card.classList.add('dragging');
  ghost.style.display='block';
  ghost.textContent = card.textContent;
  movePointer(e);
  document.querySelectorAll('.jar').forEach(j=>j.classList.remove('dragover'));
  playSound('pop');
}
function movePointer(e){
  if(!dragCard) return;
  const x = e.clientX ?? (e.touches && e.touches[0].clientX);
  const y = e.clientY ?? (e.touches && e.touches[0].clientY);
  ghost.style.left = (x - 40) + 'px';
  ghost.style.top = (y - 24) + 'px';
  const el = document.elementFromPoint(x,y);
  document.querySelectorAll('.jar').forEach(j=>j.classList.remove('dragover'));
  const jar = el && el.closest && el.closest('.jar');
  if(jar && !jar.dataset.filled) jar.classList.add('dragover');
}
function onPointerUp(e){
  if(!dragCard) return;
  const x = e.clientX ?? (e.changedTouches && e.changedTouches[0].clientX);
  const y = e.clientY ?? (e.changedTouches && e.changedTouches[0].clientY);
  const el = document.elementFromPoint(x,y);
  const jar = el && el.closest && el.closest('.jar');
  ghost.style.display='none';
  dragCard.classList.remove('dragging');
  document.querySelectorAll('.jar').forEach(j=>j.classList.remove('dragover'));

  if(jar && !isTransitioning && !jar.dataset.filled){
    handleDrop(dragCard, jar);
  } else {
    dragCard.classList.add('flyback');
    setTimeout(()=>dragCard.classList.remove('flyback'), 400);
  }
  dragCard = null;
}

/* ===== GAME LOGIC ===== */
function handleDrop(card, jar){
  const capCode = card.dataset.code;
  const jarCode = jar.dataset.code;

  console.log('Drop attempt:', {capCode, jarCode, match: capCode === jarCode});

  if(jar.dataset.filled){
    card.classList.add('flyback');
    setTimeout(()=>card.classList.remove('flyback'), 400);
    return;
  }

  if(capCode === jarCode){
    correctMatch(card, jar);
  } else {
    wrongMatch(card, jar);
  }
}

/* ===== CORRECT MATCH — premium animation ===== */
async function correctMatch(card, jar){
  const jarCode = jar.dataset.code;
  isTransitioning = true;

  playSound('whoosh');
  const cardRect = card.getBoundingClientRect();
  const jarRect = jar.getBoundingClientRect();
  card.style.transition = 'all 0.3s cubic-bezier(0.25,0.46,0.45,0.94)';
  card.style.position = 'fixed';
  card.style.left = cardRect.left + 'px';
  card.style.top = cardRect.top + 'px';
  card.style.zIndex = '200';
  card.style.pointerEvents = 'none';
  card.offsetHeight;
  card.style.left = (jarRect.left + jarRect.width/2 - cardRect.width/2) + 'px';
  card.style.top = (jarRect.top + jarRect.height/3) + 'px';
  card.style.transform = 'scale(0.5)';
  card.style.opacity = '0.3';
  await sleep(300);
  card.remove();

  jar.dataset.filled = 'true';
  jar.classList.add('correct');
  playSound('sparkle');

  spawnParticles(jar, ['✨','🌟','⭐','💫','✨'], 12);
  spawnFairyDust(jar);

  await sleep(200);
  playSound('woodClick');
  const lid = document.createElement('div');
  lid.className='cork-lid';
  jar.appendChild(lid);
  lid.offsetHeight;
  lid.classList.add('drop');
  await sleep(350);

  playSound('clink');
  spawnLightBurst(jar);
  spawnMagicalRing(jar);

  await sleep(150);
  playSound('click');
  lid.classList.add('sealed');

  spawnStarBurst(jar);

  const check = document.createElement('div');
  check.className='check-badge';
  check.textContent='✓';
  jar.appendChild(check);

  stars += 10;
  matched++;
  updateHUD();
  playSound('tada');

  await sleep(200);
  jar.classList.add('completed');
  startCompletedSparkles(jar);

  removeFloatingHint();
  isTransitioning = false;

  const batch = batches[currentBatch];
  const batchMatched = batch.filter(c=>{
    const jarEl = document.querySelector(`.jar[data-code="${c.code}"]`);
    return jarEl && jarEl.dataset.filled;
  }).length;

  if(batchMatched === batch.length){
    if(matched >= currentCountries.length){
      setTimeout(()=>showStageComplete(), 700);
    } else {
      isTransitioning = true;
      spawnParticles(document.getElementById('jars'), ['🎉','🎊','🏆','⭐','🌟']);
      await sleep(1200);
      currentBatch++;
      loadBatch();
    }
  } else {
    setTimeout(showFloatingHint, 500);
  }
}

function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

function wrongMatch(card, jar){
  playSound('wrong');
  jar.classList.add('wrong');
  const oops = document.createElement('div');
  oops.className='oops-badge show';
  oops.textContent='Oops! 🙈';
  jar.appendChild(oops);
  setTimeout(()=>{
    jar.classList.remove('wrong');
    oops.remove();
  }, 900);
  card.classList.add('flyback');
  setTimeout(()=>card.classList.remove('flyback'), 400);
}

/* ===== PARTICLE EFFECTS ===== */
function spawnParticles(anchorEl, emojis, count=10){
  const rect = anchorEl.getBoundingClientRect();
  for(let i=0;i<count;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    const startX = rect.left + rect.width/2;
    const startY = rect.top + rect.height/2;
    p.style.left = startX+'px';
    p.style.top = startY+'px';
    document.body.appendChild(p);
    const angle = Math.random()*Math.PI*2;
    const dist = 35 + Math.random()*50;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 25;
    p.animate([
      {transform:'translate(0,0) scale(0.5)', opacity:1},
      {transform:`translate(${dx}px, ${dy}px) scale(1.1)`, opacity:0}
    ], {duration:700+Math.random()*400, easing:'ease-out'});
    setTimeout(()=>p.remove(), 1200);
  }
}

function spawnFairyDust(anchorEl){
  const rect = anchorEl.getBoundingClientRect();
  for(let i=0;i<8;i++){
    const dust = document.createElement('div');
    dust.className='fairy-dust';
    dust.style.left = (rect.left + Math.random()*rect.width)+'px';
    dust.style.top = (rect.top + rect.height/2 + Math.random()*15)+'px';
    dust.style.setProperty('--dx', (Math.random()*25-12)+'px');
    dust.style.background = Math.random()>0.5 ? 'var(--gold)' : '#fff';
    document.body.appendChild(dust);
    setTimeout(()=>dust.remove(), 1200);
  }
}

function spawnLightBurst(anchorEl){
  const rect = anchorEl.getBoundingClientRect();
  const burst = document.createElement('div');
  burst.className='light-burst';
  burst.style.left = (rect.left + rect.width/2)+'px';
  burst.style.top = (rect.top + rect.height/2)+'px';
  burst.style.position='fixed';
  document.body.appendChild(burst);
  setTimeout(()=>burst.remove(), 700);
}

function spawnMagicalRing(anchorEl){
  const rect = anchorEl.getBoundingClientRect();
  const ring = document.createElement('div');
  ring.className='magical-ring';
  ring.style.left = (rect.left + rect.width/2)+'px';
  ring.style.top = (rect.top + rect.height/2)+'px';
  ring.style.position='fixed';
  document.body.appendChild(ring);
  setTimeout(()=>ring.remove(), 900);
}

function spawnStarBurst(anchorEl){
  const rect = anchorEl.getBoundingClientRect();
  const emojis = ['⭐','🌟','💫','✨','🌟','⭐'];
  for(let i=0;i<6;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.textContent = emojis[i];
    p.style.fontSize = (14+Math.random()*6)+'px';
    p.style.left = (rect.left + rect.width/2)+'px';
    p.style.top = (rect.top + rect.height/2)+'px';
    document.body.appendChild(p);
    const angle = (Math.PI*2/6)*i + Math.random()*0.4;
    const dist = 40 + Math.random()*30;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 40;
    p.animate([
      {transform:'translate(0,0) scale(0.3)', opacity:1},
      {transform:`translate(${dx}px, ${dy}px) scale(1)`, opacity:0}
    ], {duration:800, easing:'ease-out'});
    setTimeout(()=>p.remove(), 900);
  }
}

function startCompletedSparkles(jar){
  const interval = setInterval(()=>{
    if(!jar || !jar.parentNode || !jar.classList.contains('completed')){
      clearInterval(interval);
      return;
    }
    const rect = jar.getBoundingClientRect();
    const sparkle = document.createElement('div');
    sparkle.className='particle';
    sparkle.textContent='✨';
    sparkle.style.fontSize='12px';
    sparkle.style.left = (rect.left + Math.random()*rect.width)+'px';
    sparkle.style.top = (rect.top + Math.random()*rect.height)+'px';
    document.body.appendChild(sparkle);
    sparkle.animate([
      {transform:'translateY(0) scale(0.5)', opacity:0.8},
      {transform:'translateY(-20px) scale(1)', opacity:0}
    ], {duration:800, easing:'ease-out'});
    setTimeout(()=>sparkle.remove(), 900);
  }, 3000);
}

/* ===== FLOATING HINT BUBBLE (mnemonic only) ===== */
let activeHintBubble = null;
let activeHintCode = null;

function showFloatingHint(){
  removeFloatingHint();
  if(isTransitioning) return;

  const batch = batches[currentBatch];
  if(!batch) return;
  const unsolved = batch.find(c=>{
    const jar = document.querySelector(`.jar[data-code="${c.code}"]`);
    return jar && !jar.dataset.filled;
  });
  if(!unsolved) return;

  const jar = document.querySelector(`.jar[data-code="${unsolved.code}"]`);
  if(!jar) return;
  const jarWrap = jar.closest('.jar-wrap');
  if(!jarWrap) return;

  activeHintCode = unsolved.code;

  const bubble = document.createElement('div');
  bubble.className = 'hint-bubble';
  bubble.innerHTML = `<span style="font-size:14px">${unsolved.flag}</span> <span style="font-weight:700">${unsolved.name}</span><br><span style="font-size:11px;opacity:0.9">${unsolved.hint}</span>`;
  bubble.dataset.code = unsolved.code;
  jarWrap.appendChild(bubble);

  bubble.style.left = (jar.offsetLeft + jar.offsetWidth/2 - 60) + 'px';
  bubble.style.top = '-45px';

  activeHintBubble = bubble;
  emitHintSparkles(bubble);
}

function emitHintSparkles(bubble){
  if(!bubble || !bubble.parentNode) return;
  const sparkInterval = setInterval(()=>{
    if(!bubble || !bubble.parentNode){
      clearInterval(sparkInterval);
      return;
    }
    const sparkle = document.createElement('div');
    sparkle.className = 'hint-sparkle';
    sparkle.style.setProperty('--sx', (Math.random()*25-12)+'px');
    sparkle.style.setProperty('--sy', (Math.random()*25-12)+'px');
    sparkle.style.left = (Math.random()*100)+'%';
    sparkle.style.top = (Math.random()*100)+'%';
    bubble.appendChild(sparkle);
    setTimeout(()=>sparkle.remove(), 1200);
  }, 500);
  bubble._sparkInterval = sparkInterval;
}

function removeFloatingHint(){
  if(activeHintBubble){
    if(activeHintBubble._sparkInterval) clearInterval(activeHintBubble._sparkInterval);
    activeHintBubble.remove();
    activeHintBubble = null;
    activeHintCode = null;
  }
}

function flyHintToJar(code, callback){
  const bubble = document.querySelector(`.hint-bubble[data-code="${code}"]`);
  const jar = document.querySelector(`.jar[data-code="${code}"]`);
  if(!bubble || !jar){
    if(callback) callback();
    return;
  }

  if(bubble._sparkInterval) clearInterval(bubble._sparkInterval);

  const jarRect = jar.getBoundingClientRect();
  const bubbleRect = bubble.getBoundingClientRect();

  bubble.classList.add('fly-in');
  bubble.style.position = 'fixed';
  bubble.style.left = bubbleRect.left + 'px';
  bubble.style.top = bubbleRect.top + 'px';
  bubble.style.zIndex = '100';
  bubble.style.width = bubbleRect.width + 'px';

  bubble.offsetHeight;

  bubble.style.left = (jarRect.left + jarRect.width/2 - bubbleRect.width/2) + 'px';
  bubble.style.top = (jarRect.top + jarRect.height/2) + 'px';
  bubble.style.opacity = '0';
  bubble.style.transform = 'scale(0.3)';

  setTimeout(()=>{
    bubble.remove();
    if(callback) callback();
  }, 500);
}

/* ===== HINT BUTTON ===== */
/* Hint button handler is in enhancements.js */

/* ===== PAUSE ===== */
let paused = false;
document.getElementById('pause-btn').addEventListener('click', function(){
  paused = !paused;
  this.textContent = paused ? '▶ Resume' : '⏸ Pause';
  document.body.style.filter = paused ? 'grayscale(0.3) brightness(0.9)' : 'none';
});

/* ===== STAGE SELECTION ===== */
function showStageSelect(){
  document.getElementById('game-area').style.display='none';
  document.getElementById('stage-select').style.display='flex';
  document.getElementById('win-overlay').style.display='none';
  document.getElementById('stage-complete-overlay').style.display='none';
  document.getElementById('quiz-overlay').style.display='none';
  document.getElementById('level2-complete-overlay').style.display='none';
  document.getElementById('level2-area').style.display='none';
  removeFloatingHint();
  if(typeof updateStageSelectUnlocks === 'function') updateStageSelectUnlocks();
}

function selectStage(stageId){
  playSound('click');
  if(stageId === 'quiz'){
    gameMode = 'quiz';
    startQuiz();
    return;
  }
  gameMode = 'stage';
  currentStage = STAGES.find(s=>s.id===stageId);
  if(!currentStage) return;

  document.getElementById('stage-select').style.display='none';
  document.getElementById('game-area').style.display='block';
  document.getElementById('level-title').textContent = currentStage.name;

  startGame();
}

/* ===== STAGE COMPLETE ===== */
function showStageComplete(){
  playSound('tada');
  const overlay = document.getElementById('stage-complete-overlay');
  document.getElementById('stage-complete-name').textContent = currentStage.name;
  document.getElementById('stage-complete-emoji').textContent = currentStage.emoji;
  document.getElementById('stage-complete-stars').textContent = stars;
  overlay.style.display='flex';
  requestAnimationFrame(()=>overlay.classList.add('show'));
  confettiBurst();
}

/* ===== QUIZ MODE ===== */
function startQuiz(){
  gameMode = 'quiz';
  quizQuestions = generateQuizQuestions();
  quizIndex = 0;
  quizScore = 0;

  document.getElementById('stage-select').style.display='none';
  document.getElementById('game-area').style.display='block';
  document.getElementById('level-title').textContent = '🧠 Quiz';

  showQuizQuestion();
}

function generateQuizQuestions(){
  const allCountries = [
    ...(typeof COUNTRIES !== 'undefined' ? COUNTRIES : []),
    ...(typeof EUROPE_COUNTRIES !== 'undefined' ? EUROPE_COUNTRIES : []),
    ...(typeof AFRICA_COUNTRIES !== 'undefined' ? AFRICA_COUNTRIES : []),
  ];
  const shuffledAll = shuffled(allCountries);
  const questions = shuffledAll.slice(0, 10);

  return questions.map(c=>{
    const wrongOptions = shuffled(allCountries.filter(x=>x.code!==c.code)).slice(0,3).map(x=>x.capital);
    const options = shuffled([c.capital, ...wrongOptions]);
    return {
      country: c,
      options: options,
      correct: c.capital,
    };
  });
}

function showQuizQuestion(){
  if(quizIndex >= quizQuestions.length){
    showQuizComplete();
    return;
  }

  const q = quizQuestions[quizIndex];
  const overlay = document.getElementById('quiz-overlay');
  document.getElementById('quiz-flag').textContent = q.country.flag;
  document.getElementById('quiz-country').textContent = q.country.name;
  document.getElementById('quiz-hint').textContent = q.country.hint;
  document.getElementById('quiz-progress').textContent = `Question ${quizIndex+1} of ${quizQuestions.length}`;
  document.getElementById('quiz-score').textContent = `Score: ${quizScore}`;

  const optionsEl = document.getElementById('quiz-options');
  optionsEl.innerHTML = '';
  q.options.forEach(opt=>{
    const btn = document.createElement('button');
    btn.className='quiz-option';
    btn.textContent = opt;
    btn.onclick = ()=>checkQuizAnswer(opt, q.correct);
    optionsEl.appendChild(btn);
  });

  overlay.style.display='flex';
  requestAnimationFrame(()=>overlay.classList.add('show'));
}

function checkQuizAnswer(selected, correct){
  const buttons = document.querySelectorAll('.quiz-option');
  buttons.forEach(btn=>{
    btn.onclick = null;
    if(btn.textContent === correct){
      btn.classList.add('correct');
    }
    if(btn.textContent === selected && selected !== correct){
      btn.classList.add('wrong');
    }
  });

  if(selected === correct){
    playSound('correct');
    quizScore += 10;
    document.getElementById('quiz-score').textContent = `Score: ${quizScore}`;
  } else {
    playSound('wrong');
  }

  setTimeout(()=>{
    quizIndex++;
    showQuizQuestion();
  }, 1200);
}

function showQuizComplete(){
  playSound('tada');
  const overlay = document.getElementById('quiz-complete-overlay');
  document.getElementById('quiz-final-score').textContent = quizScore;
  document.getElementById('quiz-total').textContent = quizQuestions.length * 10;
  overlay.style.display='flex';
  requestAnimationFrame(()=>overlay.classList.add('show'));
  confettiBurst();
}

/* ===== WIN / CONFETTI ===== */
function confettiBurst(){
  const colors = ['🎉','🎊','✨','⭐','🌟','🧰','🧭'];
  for(let i=0;i<40;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.style.fontSize = (14+Math.random()*14)+'px';
    p.textContent = colors[Math.floor(Math.random()*colors.length)];
    p.style.left = (Math.random()*100)+'vw';
    p.style.top = '-30px';
    document.body.appendChild(p);
    const drift = (Math.random()-0.5)*200;
    p.animate([
      {transform:'translate(0,0) rotate(0deg)', opacity:1},
      {transform:`translate(${drift}px, ${window.innerHeight+60}px) rotate(360deg)`, opacity:0.9}
    ], {duration:2200+Math.random()*1200, easing:'ease-in'});
    setTimeout(()=>p.remove(), 3600);
  }
}

/* ===== BUTTON EVENT LISTENERS ===== */
document.getElementById('continue-btn').addEventListener('click', ()=>{
  document.getElementById('win-overlay').classList.remove('show');
  setTimeout(()=>{document.getElementById('win-overlay').style.display='none';}, 300);
});

document.getElementById('stage-continue-btn').addEventListener('click', ()=>{
  document.getElementById('stage-complete-overlay').classList.remove('show');
  setTimeout(()=>{
    document.getElementById('stage-complete-overlay').style.display='none';
    showStageSelect();
  }, 300);
});

document.getElementById('quiz-continue-btn').addEventListener('click', ()=>{
  document.getElementById('quiz-complete-overlay').classList.remove('show');
  setTimeout(()=>{
    document.getElementById('quiz-complete-overlay').style.display='none';
    showStageSelect();
  }, 300);
});

document.getElementById('back-btn').addEventListener('click', ()=>{
  showStageSelect();
});

document.getElementById('quiz-back-btn').addEventListener('click', ()=>{
  document.getElementById('quiz-overlay').classList.remove('show');
  setTimeout(()=>{
    document.getElementById('quiz-overlay').style.display='none';
    showStageSelect();
  }, 300);
});

/* ===== INIT ===== */
buildScenery();
showStageSelect();
