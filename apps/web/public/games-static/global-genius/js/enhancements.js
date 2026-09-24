/* ===== GAME ENHANCEMENTS — Hearts, Combo, Coins, Celebrations, Unlock ===== */

/* ===== STATE ===== */
let comboCount = 0;
let hearts = 3;
let totalMoves = 0;
let correctMoves = 0;
let startTime = 0;
let earnedCoins = 0;
let hintHighlightedCard = null;
let hintArrow = null;
let hintTimeout = null;

/* unlock system */
let unlockedStages = ['asia', 'europe', 'africa'];
let stageProgress = {
  asia: {completed: false, stars: 0},
  europe: {completed: false, stars: 0},
  africa: {completed: false, stars: 0},
};

/* ===== COMBO SYSTEM ===== */
function getComboBonus(count){
  if(count >= 7) return 15;
  if(count >= 5) return 10;
  if(count >= 3) return 5;
  return 0;
}

function showComboReward(count){
  const bonus = getComboBonus(count);
  const el = document.createElement('div');
  el.className = 'combo-text';
  el.innerHTML = `<div class="combo-main">Combo x${count}!</div><div class="combo-bonus">+${bonus} Bonus!</div>`;
  document.body.appendChild(el);

  playSound('sparkle');
  spawnComboParticles();

  setTimeout(()=>el.remove(), 1400);
}

function spawnComboParticles(){
  const emojis = ['🔥','💥','⚡','✨','🌟'];
  for(let i=0;i<8;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    p.style.left = (30+Math.random()*40)+'vw';
    p.style.top = (30+Math.random()*20)+'vh';
    p.style.fontSize = (16+Math.random()*10)+'px';
    document.body.appendChild(p);
    const dx = (Math.random()-0.5)*120;
    const dy = -30-Math.random()*80;
    p.animate([
      {transform:'translate(0,0) scale(0.5)', opacity:1},
      {transform:`translate(${dx}px, ${dy}px) scale(1.2)`, opacity:0}
    ], {duration:600+Math.random()*400, easing:'ease-out'});
    setTimeout(()=>p.remove(), 1100);
  }
}

/* ===== HEARTS SYSTEM ===== */
function loseHeart(){
  if(hearts <= 0) return;
  hearts--;
  updateHeartsDisplay();
  comboCount = 0;
  updateComboDisplay();

  if(hearts <= 0){
    setTimeout(()=>showRetryDialog(), 600);
  }
}

function updateHeartsDisplay(){
  const el = document.getElementById('hearts');
  if(!el) return;
  let html = '';
  for(let i=0;i<3;i++){
    if(i < hearts){
      html += '<span class="heart-full">❤️</span>';
    } else {
      html += '<span class="heart-empty">🖤</span>';
    }
  }
  el.innerHTML = html;

  /* shake animation on heart loss */
  el.classList.add('heart-lost');
  setTimeout(()=>el.classList.remove('heart-lost'), 500);
}

function resetHearts(){
  hearts = 3;
  updateHeartsDisplay();
}

function showRetryDialog(){
  const overlay = document.getElementById('retry-overlay');
  if(overlay){
    overlay.style.display = 'flex';
    requestAnimationFrame(()=>overlay.classList.add('show'));
  }
}

function retryLevel(){
  const overlay = document.getElementById('retry-overlay');
  overlay.classList.remove('show');
  setTimeout(()=>{overlay.style.display='none';}, 300);

  resetHearts();
  comboCount = 0;
  totalMoves = 0;
  correctMoves = 0;
  startGame();
}

/* ===== COMBO DISPLAY ===== */
function updateComboDisplay(){
  const el = document.getElementById('combo-display');
  if(!el) return;
  if(comboCount >= 2){
    el.style.display = 'flex';
    el.innerHTML = `<span class="combo-icon">🔥</span><span class="combo-count">x${comboCount}</span>`;
    el.classList.remove('combo-pulse');
    void el.offsetWidth;
    el.classList.add('combo-pulse');
  } else {
    el.style.display = 'none';
  }
}

/* ===== COIN SYSTEM ===== */
function awardCoins(amount){
  earnedCoins += amount;
  document.getElementById('coin-count').textContent = earnedCoins;
}

function animateCoinToCounter(amount, fromEl){
  if(!fromEl) return;
  const rect = fromEl.getBoundingClientRect();
  const counter = document.querySelector('.coin-pill');
  if(!counter) return;
  const counterRect = counter.getBoundingClientRect();

  for(let i=0;i<Math.min(amount, 5);i++){
    setTimeout(()=>{
      const coin = document.createElement('div');
      coin.className = 'coin-fly';
      coin.style.left = (rect.left + rect.width/2) + 'px';
      coin.style.top = (rect.top + rect.height/2) + 'px';
      document.body.appendChild(coin);

      const dx = counterRect.left - rect.left;
      const dy = counterRect.top - rect.top;

      coin.animate([
        {transform:'scale(1) rotate(0deg)', opacity:1},
        {transform:`translate(${dx}px, ${dy}px) scale(0.3) rotate(360deg)`, opacity:0.8}
      ], {duration:500, easing:'cubic-bezier(0.25,0.46,0.45,0.94)'});

      setTimeout(()=>{
        coin.remove();
        if(i === Math.min(amount,5)-1){
          awardCoins(amount);
          counter.classList.add('coin-bounce');
          setTimeout(()=>counter.classList.remove('coin-bounce'), 400);
        }
      }, 500);
    }, i * 80);
  }
}

/* ===== CELEBRATION MESSAGES ===== */
const CELEBRATION_MESSAGES = [
  'Excellent!', 'Great Job!', 'Awesome!', 'Perfect!',
  'Amazing!', 'Fantastic!', 'Brilliant!', 'Well Done!',
  'Superb!', 'Outstanding!', 'Wonderful!', 'Bravo!'
];

function showCelebrationMessage(anchorEl){
  const rect = anchorEl.getBoundingClientRect();
  const msg = CELEBRATION_MESSAGES[Math.floor(Math.random()*CELEBRATION_MESSAGES.length)];

  const el = document.createElement('div');
  el.className = 'celebration-text';
  el.textContent = msg;
  el.style.left = (rect.left + rect.width/2) + 'px';
  el.style.top = (rect.top) + 'px';
  document.body.appendChild(el);

  setTimeout(()=>el.remove(), 1500);
}

function showHalfwayCelebration(){
  const el = document.createElement('div');
  el.className = 'combo-text';
  el.innerHTML = '<div class="combo-main">Halfway There!</div><div class="combo-bonus">Keep Going!</div>';
  document.body.appendChild(el);
  playSound('sparkle');
  setTimeout(()=>el.remove(), 1500);
}

/* ===== CONFETTI BURST (lighter) ===== */
function confettiBurstLight(){
  const colors = ['🎉','🎊','✨','⭐','🌟'];
  for(let i=0;i<20;i++){
    const p = document.createElement('div');
    p.className='particle';
    p.style.fontSize = (12+Math.random()*10)+'px';
    p.textContent = colors[Math.floor(Math.random()*colors.length)];
    p.style.left = (Math.random()*100)+'vw';
    p.style.top = '-20px';
    document.body.appendChild(p);
    const drift = (Math.random()-0.5)*150;
    p.animate([
      {transform:'translate(0,0) rotate(0deg)', opacity:1},
      {transform:`translate(${drift}px, ${window.innerHeight+40}px) rotate(360deg)`, opacity:0.8}
    ], {duration:1800+Math.random()*800, easing:'ease-in'});
    setTimeout(()=>p.remove(), 2800);
  }
}

/* ===== HINT HIGHLIGHT SYSTEM ===== */
function showInteractiveHint(){
  clearHintHighlight();
  if(isTransitioning) return;

  const batch = batches[currentBatch];
  if(!batch) return;

  /* find first unsolved jar */
  const unsolved = batch.find(c=>{
    const jar = document.querySelector(`.jar[data-code="${c.code}"]`);
    return jar && !jar.dataset.filled;
  });
  if(!unsolved) return;

  /* find matching card */
  const card = document.querySelector(`.capital-card[data-code="${unsolved.code}"]`);
  if(!card) return;

  /* highlight card */
  card.classList.add('hint-highlight');
  hintHighlightedCard = card;

  /* create arrow */
  const arrow = document.createElement('div');
  arrow.className = 'hint-arrow';
  arrow.textContent = '👇';
  card.parentElement.style.position = 'relative';
  arrow.style.position = 'absolute';
  arrow.style.top = '-28px';
  arrow.style.left = '50%';
  arrow.style.transform = 'translateX(-50%)';
  arrow.style.zIndex = '50';
  card.parentElement.appendChild(arrow);
  hintArrow = arrow;

  /* auto-hide after 4 seconds */
  hintTimeout = setTimeout(clearHintHighlight, 4000);
}

function clearHintHighlight(){
  if(hintHighlightedCard){
    hintHighlightedCard.classList.remove('hint-highlight');
    hintHighlightedCard = null;
  }
  if(hintArrow){
    hintArrow.remove();
    hintArrow = null;
  }
  if(hintTimeout){
    clearTimeout(hintTimeout);
    hintTimeout = null;
  }
}

/* ===== UNLOCK SYSTEM ===== */
function getNextStage(currentId){
  const order = ['asia', 'europe', 'africa'];
  const idx = order.indexOf(currentId);
  if(idx >= 0 && idx < order.length - 1){
    return STAGES.find(s=>s.id === order[idx+1]);
  }
  return null;
}

function checkAndUnlockNextStage(completedStageId){
  stageProgress[completedStageId].completed = true;
  stageProgress[completedStageId].stars = stars;

  const next = getNextStage(completedStageId);
  if(next && !unlockedStages.includes(next.id)){
    unlockedStages.push(next.id);
    showUnlockAnimation(next);
    return true;
  }
  return false;
}

function showUnlockAnimation(stage){
  const overlay = document.getElementById('unlock-overlay');
  if(!overlay) return;

  document.getElementById('unlock-emoji').textContent = stage.emoji;
  document.getElementById('unlock-text').textContent = `${stage.name} Unlocked!`;
  overlay.style.display = 'flex';
  requestAnimationFrame(()=>overlay.classList.add('show'));

  playSound('tada');
  confettiBurstLight();

  setTimeout(()=>{
    overlay.classList.remove('show');
    setTimeout(()=>{overlay.style.display='none';}, 400);
  }, 2500);
}

function updateStageSelectUnlocks(){
  document.querySelectorAll('.stage-btn[data-stage]').forEach(btn=>{
    const stageId = btn.dataset.stage;
    const isUnlocked = unlockedStages.includes(stageId);
    const isCompleted = stageProgress[stageId] && stageProgress[stageId].completed;

    btn.classList.toggle('locked', !isUnlocked);
    btn.classList.toggle('completed-stage', isCompleted);

    let statusEl = btn.querySelector('.stage-status');
    if(!statusEl){
      statusEl = document.createElement('span');
      statusEl.className = 'stage-status';
      btn.appendChild(statusEl);
    }

    if(!isUnlocked){
      statusEl.innerHTML = '🔒';
      statusEl.className = 'stage-status lock';
    } else if(isCompleted){
      statusEl.innerHTML = '✅';
      statusEl.className = 'stage-status done';
    } else {
      statusEl.innerHTML = '';
      statusEl.className = 'stage-status';
    }
  });
}

/* ===== END OF LEVEL SCREEN ===== */
function calculateStarRating(){
  if(totalMoves === 0) return 1;
  const accuracy = correctMoves / totalMoves;
  if(hearts === 3 && accuracy >= 0.9) return 3;
  if(accuracy >= 0.7) return 2;
  return 1;
}

function formatTime(seconds){
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function showEnhancedStageComplete(){
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  const rating = calculateStarRating();
  const accuracy = totalMoves > 0 ? Math.round(correctMoves / totalMoves * 100) : 100;

  /* bonus coins */
  const timeBonus = Math.max(0, 30 - elapsed);
  const accuracyBonus = Math.floor(accuracy / 10);
  const totalBonus = timeBonus + accuracyBonus;

  const overlay = document.getElementById('stage-complete-overlay');
  const card = document.getElementById('stage-complete-card');

  /* update card content */
  card.innerHTML = `
    <div id="stage-complete-emoji" style="font-size:50px;">${currentStage.emoji}</div>
    <h2>${currentStage.name} Complete!</h2>
    <div class="end-stars">${'⭐'.repeat(rating)}${'☆'.repeat(3-rating)}</div>
    <div class="end-stats">
      <div class="end-stat">
        <span class="end-stat-icon">🪙</span>
        <span class="end-stat-value">${earnedCoins}</span>
        <span class="end-stat-label">Coins</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-icon">🎯</span>
        <span class="end-stat-value">${accuracy}%</span>
        <span class="end-stat-label">Accuracy</span>
      </div>
      <div class="end-stat">
        <span class="end-stat-icon">⏱️</span>
        <span class="end-stat-value">${formatTime(elapsed)}</span>
        <span class="end-stat-label">Time</span>
      </div>
    </div>
    ${totalBonus > 0 ? `<div class="end-bonus">Level Bonus: +${totalBonus} 🪙</div>` : ''}
    <div class="stamp">🛂 Region Mastered</div>
    <div class="end-buttons">
      <button class="ctrl-btn gold" onclick="goToNextStage()">🚀 Next</button>
      <button class="ctrl-btn" onclick="retryStage()">🔄 Replay</button>
      <button class="ctrl-btn" onclick="backToStageSelect()">🏠 Home</button>
    </div>
  `;

  overlay.style.display='flex';
  requestAnimationFrame(()=>overlay.classList.add('show'));
  confettiBurst();
  playSound('tada');
}

function goToNextStage(){
  document.getElementById('stage-complete-overlay').classList.remove('show');
  setTimeout(()=>{document.getElementById('stage-complete-overlay').style.display='none';}, 300);

  const next = getNextStage(currentStage.id);
  if(next && unlockedStages.includes(next.id)){
    selectStage(next.id);
  } else {
    showStageSelect();
  }
}

function retryStage(){
  document.getElementById('stage-complete-overlay').classList.remove('show');
  setTimeout(()=>{document.getElementById('stage-complete-overlay').style.display='none';}, 300);
  resetHearts();
  comboCount = 0;
  totalMoves = 0;
  correctMoves = 0;
  earnedCoins = 0;
  startTime = Date.now();
  startGame();
}

function backToStageSelect(){
  document.getElementById('stage-complete-overlay').classList.remove('show');
  setTimeout(()=>{document.getElementById('stage-complete-overlay').style.display='none';}, 300);
  showStageSelect();
}

/* ===== ENHANCED CORRECT MATCH ===== */
function enhancedCorrectMatch(card, jar){
  comboCount++;
  correctMoves++;
  totalMoves++;

  const coinReward = 5 + (comboCount >= 3 ? getComboBonus(comboCount) : 0);
  awardCoins(coinReward);

  updateComboDisplay();

  if(comboCount >= 3){
    showComboReward(comboCount);
  }

  showCelebrationMessage(jar);

  const coinEl = document.createElement('div');
  coinEl.className = 'coin-indicator';
  coinEl.textContent = `+${coinReward} 🪙`;
  const jarRect = jar.getBoundingClientRect();
  coinEl.style.position = 'fixed';
  coinEl.style.left = (jarRect.left + jarRect.width/2 - 30) + 'px';
  coinEl.style.top = (jarRect.top - 10) + 'px';
  coinEl.style.zIndex = '100';
  document.body.appendChild(coinEl);
  coinEl.animate([
    {transform:'translateY(0) scale(0.8)', opacity:0},
    {transform:'translateY(-20px) scale(1)', opacity:1},
    {transform:'translateY(-50px) scale(0.9)', opacity:0}
  ], {duration:1200, easing:'ease-out'});
  setTimeout(()=>coinEl.remove(), 1300);
}

/* ===== ENHANCED WRONG MATCH ===== */
function enhancedWrongMatch(){
  totalMoves++;
  loseHeart();
}

/* ===== HINT BUTTON OVERRIDE & INIT ===== */
document.addEventListener('DOMContentLoaded', ()=>{
  /* patch game.js functions now that they're defined */
  if(typeof window.correctMatch === 'function'){
    const _origCorrectMatch = window.correctMatch;
    window.correctMatch = async function(card, jar){
      enhancedCorrectMatch(card, jar);
      await _origCorrectMatch.call(this, card, jar);
    };
  }

  if(typeof window.wrongMatch === 'function'){
    const _origWrongMatch = window.wrongMatch;
    window.wrongMatch = function(card, jar){
      enhancedWrongMatch();
      _origWrongMatch.call(this, card, jar);
    };
  }

  if(typeof window.startGame === 'function'){
    const _origStartGame = window.startGame;
    window.startGame = function(){
      comboCount = 0;
      totalMoves = 0;
      correctMoves = 0;
      earnedCoins = 0;
      startTime = Date.now();
      resetHearts();
      updateComboDisplay();
      document.getElementById('coin-count').textContent = '0';
      _origStartGame.call(this);
    };
  }

  if(typeof window.showStageComplete === 'function'){
    const _origShowStageComplete = window.showStageComplete;
    window.showStageComplete = function(){
      if(currentStage){
        checkAndUnlockNextStage(currentStage.id);
      }
      showEnhancedStageComplete();
    };
  }

  if(typeof window.updateHUD === 'function'){
    const _origUpdateHUD = window.updateHUD;
    window.updateHUD = function(){
      _origUpdateHUD.call(this);
      if(matched === Math.floor(currentCountries.length / 2) && matched > 0){
        showHalfwayCelebration();
      }
    };
  }

  const hintBtn = document.getElementById('hint-btn');
  if(hintBtn){
    hintBtn.addEventListener('click', ()=>{
      if(isTransitioning) return;
      clearHintHighlight();
      removeFloatingHint();
      setTimeout(showInteractiveHint, 100);
    });
  }

  /* init hearts display */
  updateHeartsDisplay();

  /* update stage select unlocks */
  updateStageSelectUnlocks();
});
