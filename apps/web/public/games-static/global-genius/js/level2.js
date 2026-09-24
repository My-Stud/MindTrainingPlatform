/* ===== LEVEL 2 — SHELF SORTING PUZZLE ===== */

let level2State = {
  shelves: [[], [], [], []],
  selectedCard: null,
  selectedShelf: null,
  currentDifficulty: 'easy',
  currentData: [],
  completedShelves: 0,
  totalShelves: 3,
  stars: 0,
  moveCount: 0,
  undoCount: 3,
  history: [],
  level: 1,
  hearts: 3,
  comboCount: 0,
  correctMoves: 0,
  totalMoves: 0,
  startTime: 0,
  earnedCoins: 0,
};

/* ===== SOUND SYSTEM ===== */
function playLevel2Sound(type){
  try { ensureAudio(); } catch(e){ return; }
  const now = audioCtx.currentTime;

  switch(type){
    case 'pickup': {
      const osc = audioCtx.createOscillator();
      osc.type='sine'; osc.frequency.value=600;
      osc.frequency.exponentialRampToValueAtTime(900, now+0.06);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.1);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.12);
      break;
    }
    case 'place': {
      const osc = audioCtx.createOscillator();
      osc.type='sine'; osc.frequency.value=500;
      osc.frequency.exponentialRampToValueAtTime(350, now+0.08);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.12);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.15);
      break;
    }
    case 'wrong': {
      const osc = audioCtx.createOscillator();
      osc.type='triangle'; osc.frequency.value=180;
      osc.frequency.exponentialRampToValueAtTime(120, now+0.2);
      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now+0.25);
      osc.connect(gain).connect(audioCtx.destination);
      osc.start(now); osc.stop(now+0.3);
      break;
    }
    case 'complete': {
      [523, 659, 784, 1047].forEach((freq,i)=>{
        const osc = audioCtx.createOscillator();
        osc.type='triangle'; osc.frequency.value=freq;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0, now+i*0.08);
        gain.gain.linearRampToValueAtTime(0.08, now+i*0.08+0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now+i*0.08+0.4);
        osc.connect(gain).connect(audioCtx.destination);
        osc.start(now+i*0.08); osc.stop(now+i*0.08+0.45);
      });
      break;
    }
  }
}

/* ===== INITIALIZE LEVEL 2 ===== */
function initLevel2(difficulty='easy'){
  level2State.currentDifficulty = difficulty;
  level2State.currentData = LEVEL2_DATA[difficulty];
  level2State.totalShelves = level2State.currentData.length;
  level2State.completedShelves = 0;
  level2State.stars = 0;
  level2State.moveCount = 0;
  level2State.undoCount = 3;
  level2State.history = [];
  level2State.shelves = Array.from({length: level2State.totalShelves + 1}, () => []);
  level2State.selectedCard = null;
  level2State.selectedShelf = null;
  level2State.level = 2;
  level2State.hearts = 3;
  level2State.comboCount = 0;
  level2State.correctMoves = 0;
  level2State.totalMoves = 0;
  level2State.startTime = Date.now();
  level2State.earnedCoins = 0;

  distributeItems();
  renderShelves();
  updateLevel2HUD();
  updateLevel2HeartsDisplay();
  clearTargetHighlight();
}

/* ===== DISTRIBUTE ITEMS RANDOMLY ===== */
function distributeItems(){
  const allItems = [];

  level2State.currentData.forEach((item, idx)=>{
    allItems.push({
      id: `${idx}-country`,
      type: 'country',
      value: item.country,
      flag: item.flag,
      icon: '🌍',
      groupIdx: idx,
    });
    allItems.push({
      id: `${idx}-capital`,
      type: 'capital',
      value: item.capital,
      flag: item.flag,
      icon: '📍',
      groupIdx: idx,
    });
    allItems.push({
      id: `${idx}-currency`,
      type: 'currency',
      value: item.currency,
      flag: item.flag,
      icon: '💰',
      groupIdx: idx,
    });
  });

  /* shuffle */
  for(let i=allItems.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    [allItems[i],allItems[j]]=[allItems[j],allItems[i]];
  }

  /* 3 items per shelf, empty shelf after every 2 filled shelves */
  const itemsPerShelf = 3;
  const filledCount = Math.ceil(allItems.length / itemsPerShelf);
  const emptyCount = Math.ceil(filledCount / 2);
  const totalSlots = filledCount + emptyCount;

  /* reset shelves */
  level2State.shelves = Array.from({length: totalSlots}, () => []);

  /* build layout: [FILLED][FILLED][EMPTY][FILLED][FILLED][EMPTY]... */
  let itemIdx = 0;
  let filledPlaced = 0;
  let needEmpty = false;

  for(let i=0; i<totalSlots && itemIdx<allItems.length; i++){
    if(needEmpty){
      /* this slot is empty — skip it */
      needEmpty = false;
      continue;
    }
    /* fill this shelf with up to 3 items */
    for(let j=0; j<itemsPerShelf && itemIdx<allItems.length; j++){
      level2State.shelves[i].push(allItems[itemIdx]);
      itemIdx++;
    }
    filledPlaced++;
    /* after every 2 filled shelves, next slot is empty */
    if(filledPlaced % 2 === 0){
      needEmpty = true;
    }
  }

  level2State.totalShelves = filledCount;
}

/* ===== RENDER SHELVES ===== */
function renderShelves(){
  const container = document.getElementById('level2-shelves');
  if(!container) return;

  container.innerHTML = '';

  level2State.shelves.forEach((shelf, shelfIdx)=>{
    const shelfEl = document.createElement('div');
    shelfEl.className = 'level2-shelf';
    shelfEl.dataset.shelf = shelfIdx;

    if(shelf.length === 0){
      shelfEl.classList.add('empty');
    }

    /* check if shelf is complete */
    if(isShelfComplete(shelfIdx)){
      shelfEl.classList.add('completed');
    }

    /* items container */
    const itemsEl = document.createElement('div');
    itemsEl.className = 'level2-items';

    if(shelf.length === 0){
      const emptyLabel = document.createElement('div');
      emptyLabel.className = 'empty-label';
      emptyLabel.textContent = 'Drop here';
      itemsEl.appendChild(emptyLabel);
    } else {
      shelf.forEach((item, itemIdx)=>{
        const itemEl = document.createElement('div');
        itemEl.className = 'level2-item';
        itemEl.dataset.itemId = item.id;
        itemEl.dataset.shelf = shelfIdx;
        itemEl.dataset.position = itemIdx;

        /* only edge (first or last) items are interactive */
        const isEdge = (itemIdx === 0 || itemIdx === shelf.length - 1);
        if(isEdge){
          itemEl.classList.add('edge');
        }

        /* check if this item is selected */
        if(level2State.selectedCard && level2State.selectedCard.id === item.id){
          itemEl.classList.add('selected');
        }

        /* type badge */
        const typeBadge = document.createElement('div');
        typeBadge.className = `item-type ${item.type}`;
        typeBadge.textContent = item.icon;

        /* icon */
        const icon = document.createElement('div');
        icon.className = 'item-icon';
        icon.textContent = item.flag || item.icon;

        /* label */
        const label = document.createElement('div');
        label.className = 'item-label';
        label.textContent = item.value;

        itemEl.appendChild(typeBadge);
        itemEl.appendChild(icon);
        itemEl.appendChild(label);

        /* click handler */
        itemEl.addEventListener('click', (e)=>{
          e.stopPropagation();
          console.log('Item element clicked!');
          handleItemClick(shelfIdx, itemIdx);
        });

        itemsEl.appendChild(itemEl);
      });
    }

    shelfEl.appendChild(itemsEl);

    /* shelf plank */
    const plank = document.createElement('div');
    plank.className = 'level2-shelf-plank';
    shelfEl.appendChild(plank);

    /* completion overlay */
    const overlay = document.createElement('div');
    overlay.className = 'check-overlay';
    overlay.textContent = '✓';
    shelfEl.appendChild(overlay);

    /* click handler for shelf (to place item) */
    shelfEl.addEventListener('click', ()=>{
      handleShelfClick(shelfIdx);
    });

    container.appendChild(shelfEl);
  });
}

/* ===== HANDLE ITEM CLICK ===== */
function handleItemClick(shelfIdx, itemIdx){
  const shelf = level2State.shelves[shelfIdx];
  const item = shelf[itemIdx];

  /* only allow picking edge (first or last) items */
  const isEdge = (itemIdx === 0 || itemIdx === shelf.length - 1);
  if(!isEdge){
    playLevel2Sound('wrong');
    shakeShelf(shelfIdx);
    showHintPopup('Only EDGE items can be moved!');
    return;
  }

  /* if already selected, deselect */
  if(level2State.selectedCard && level2State.selectedShelf === shelfIdx){
    level2State.selectedCard = null;
    level2State.selectedShelf = null;
    clearTargetHighlight();
    renderShelves();
    return;
  }

  /* select this item */
  level2State.selectedCard = item;
  level2State.selectedShelf = shelfIdx;
  playLevel2Sound('pickup');
  renderShelves();

  /* show where this item belongs */
  showItemDestinationHint(item);
}

/* ===== FIND CORRECT SHELF FOR ITEM ===== */
function findTargetShelf(item){
  for(let i=0; i<level2State.shelves.length; i++){
    const shelf = level2State.shelves[i];
    if(shelf.length === 0) continue;
    if(isShelfComplete(i)) continue;

    /* check if any item on this shelf belongs to same group */
    const groupMatch = shelf.find(s=>s.groupIdx === item.groupIdx);
    if(groupMatch) return i;
  }

  /* find an empty shelf */
  for(let i=0; i<level2State.shelves.length; i++){
    if(level2State.shelves[i].length === 0 && !isShelfComplete(i)) return i;
  }

  return -1;
}

/* ===== SHOW ITEM DESTINATION HINT ===== */
function showItemDestinationHint(item){
  const targetIdx = findTargetShelf(item);
  const data = level2State.currentData[item.groupIdx];

  let hintText = '';
  if(item.type === 'country'){
    hintText = `🌍 ${item.value} → Put with ${data.capital} and ${data.currency}`;
  } else if(item.type === 'capital'){
    hintText = `📍 ${item.value} → Put with ${data.country} and ${data.currency}`;
  } else {
    hintText = `💰 ${item.value} → Put with ${data.country} and ${data.capital}`;
  }

  if(targetIdx >= 0){
    hintText += ` (Shelf ${targetIdx + 1})`;
  }

  showHintPopup(`👆 ${hintText}`);

  /* highlight and scroll to target shelf */
  if(targetIdx >= 0){
    highlightTargetShelf(targetIdx);
    scrollToShelf(targetIdx);
  }
}

/* ===== HIGHLIGHT TARGET SHELF ===== */
function highlightTargetShelf(shelfIdx){
  clearTargetHighlight();
  const shelfEl = document.querySelector(`.level2-shelf[data-shelf="${shelfIdx}"]`);
  if(shelfEl){
    shelfEl.classList.add('target-highlight');
  }
}

function clearTargetHighlight(){
  document.querySelectorAll('.level2-shelf.target-highlight').forEach(el=>{
    el.classList.remove('target-highlight');
  });
}

/* ===== SCROLL TO SHELF ===== */
function scrollToShelf(shelfIdx){
  const shelfEl = document.querySelector(`.level2-shelf[data-shelf="${shelfIdx}"]`);
  if(shelfEl){
    shelfEl.scrollIntoView({behavior:'smooth', block:'center'});
  }
}

/* ===== HANDLE SHELF CLICK (to place item) ===== */
function handleShelfClick(shelfIdx){
  console.log('Shelf clicked:', {shelfIdx, selectedCard: level2State.selectedCard});

  if(!level2State.selectedCard) return;
  if(level2State.selectedShelf === shelfIdx) return;

  const targetShelf = level2State.shelves[shelfIdx];

  /* check max capacity */
  if(targetShelf.length >= 3){
    playLevel2Sound('wrong');
    shakeShelf(shelfIdx);
    showHintPopup('Shelf is full! (Max 3 items)');
    return;
  }

  /* save to history for undo */
  level2State.history.push({
    from: level2State.selectedShelf,
    to: shelfIdx,
    item: level2State.selectedCard,
  });

  /* move item */
  const sourceShelf = level2State.shelves[level2State.selectedShelf];
  const itemIdx = sourceShelf.findIndex(c=>c.id === level2State.selectedCard.id);

  if(itemIdx === -1) return;

  /* remove from source */
  sourceShelf.splice(itemIdx, 1);

  /* add to target */
  targetShelf.push(level2State.selectedCard);

  level2State.moveCount++;
  level2State.selectedCard = null;
  level2State.selectedShelf = null;
  clearTargetHighlight();

  playLevel2Sound('place');

  /* check if target shelf is now complete */
  if(isShelfComplete(shelfIdx)){
    completeShelf(shelfIdx);
  } else {
    renderShelves();
  }

  updateLevel2HUD();
}

/* ===== CHECK IF SHELF IS COMPLETE ===== */
function isShelfComplete(shelfIdx){
  const shelf = level2State.shelves[shelfIdx];
  if(shelf.length < 3) return false;

  /* check if 3 items of the same group exist on this shelf */
  const groupCounts = {};
  shelf.forEach(item => {
    groupCounts[item.groupIdx] = (groupCounts[item.groupIdx] || 0) + 1;
  });

  /* complete if any group has all 3 items (country + capital + currency) */
  return Object.values(groupCounts).some(count => count === 3);
}

/* ===== COMPLETE SHELF ANIMATION ===== */
async function completeShelf(shelfIdx){
  playLevel2Sound('complete');

  const shelfEl = document.querySelector(`.level2-shelf[data-shelf="${shelfIdx}"]`);
  if(shelfEl){
    shelfEl.classList.add('completed');
  }

  /* spawn particles */
  if(shelfEl){
    spawnLevel2Particles(shelfEl, ['✨','🌟','⭐','💫','🎉']);
  }

  level2State.completedShelves++;
  level2State.stars += 10;

  await sleep(600);
  renderShelves();
  updateLevel2HUD();

  /* check if all shelves complete */
  if(level2State.completedShelves >= level2State.totalShelves){
    setTimeout(()=>showLevel2Complete(), 800);
  }
}

/* ===== SHAKE SHELF ON WRONG MOVE ===== */
function shakeShelf(shelfIdx){
  const shelfEl = document.querySelector(`.level2-shelf[data-shelf="${shelfIdx}"]`);
  if(shelfEl){
    shelfEl.classList.add('shake');
    setTimeout(()=>shelfEl.classList.remove('shake'), 500);
  }
}

/* ===== UNDO LAST MOVE ===== */
function undoLastMove(){
  if(level2State.undoCount <= 0){
    showHintPopup('No undos left!');
    return;
  }

  if(level2State.history.length === 0){
    showHintPopup('Nothing to undo!');
    return;
  }

  const lastMove = level2State.history.pop();
  level2State.undoCount--;

  /* reverse the move */
  const sourceShelf = level2State.shelves[lastMove.to];
  const targetShelf = level2State.shelves[lastMove.from];

  const itemIdx = sourceShelf.findIndex(c=>c.id === lastMove.item.id);
  if(itemIdx !== -1){
    sourceShelf.splice(itemIdx, 1);
    targetShelf.push(lastMove.item);
  }

  playLevel2Sound('place');
  renderShelves();
  updateLevel2HUD();
  showHintPopup('Move undone!');
}

/* ===== SPAWN PARTICLES ===== */
function spawnLevel2Particles(anchorEl, emojis){
  const rect = anchorEl.getBoundingClientRect();
  for(let i=0;i<12;i++){
    const p = document.createElement('div');
    p.className='level2-particle';
    p.textContent = emojis[Math.floor(Math.random()*emojis.length)];
    p.style.left = (rect.left + rect.width/2)+'px';
    p.style.top = (rect.top + rect.height/2)+'px';
    document.body.appendChild(p);
    const angle = Math.random()*Math.PI*2;
    const dist = 40 + Math.random()*50;
    const dx = Math.cos(angle)*dist;
    const dy = Math.sin(angle)*dist - 30;
    p.animate([
      {transform:'translate(0,0) scale(0.5)', opacity:1},
      {transform:`translate(${dx}px, ${dy}px) scale(1.1)`, opacity:0}
    ], {duration:700+Math.random()*400, easing:'ease-out'});
    setTimeout(()=>p.remove(), 1200);
  }
}

/* ===== SHOW HINT POPUP ===== */
function showHintPopup(message){
  const popup = document.getElementById('level2-hint-popup');
  if(!popup) return;

  popup.textContent = message;
  popup.classList.add('show');

  setTimeout(()=>{
    popup.classList.remove('show');
  }, 2500);
}

/* ===== HINT SYSTEM ===== */
function showLevel2Hint(){
  /* find first incomplete shelf */
  for(let i=0; i<level2State.shelves.length; i++){
    const shelf = level2State.shelves[i];
    if(shelf.length === 0 || isShelfComplete(i)) continue;

    /* find an edge item (first or last) that doesn't belong */
    let edgeItem = null;
    if(shelf.length > 1){
      /* check if first item is misplaced */
      if(shelf[0].groupIdx !== shelf[1].groupIdx){
        edgeItem = shelf[0];
      } else if(shelf[shelf.length-1].groupIdx !== shelf[shelf.length-2].groupIdx){
        edgeItem = shelf[shelf.length-1];
      }
    }
    if(!edgeItem) edgeItem = shelf[shelf.length - 1];
    const data = level2State.currentData[edgeItem.groupIdx];

    /* find where this item should go */
    const targetIdx = findTargetShelf(edgeItem);

    let hintText = '';
    if(edgeItem.type === 'country'){
      hintText = `${edgeItem.flag} ${edgeItem.value} → ${data.capital} & ${data.currency}`;
    } else if(edgeItem.type === 'capital'){
      hintText = `${data.flag} ${data.country}'s capital → ${edgeItem.value}`;
    } else {
      hintText = `${data.flag} ${data.country} → ${edgeItem.value}`;
    }

    if(targetIdx >= 0){
      hintText += ` → Shelf ${targetIdx + 1}`;
      highlightTargetShelf(targetIdx);
      scrollToShelf(targetIdx);
    }

    showHintPopup(`💡 ${hintText}`);
    return;
  }

  showHintPopup('✅ All sorted! Great job!');
}

/* ===== UPDATE HUD ===== */
const LEVEL2_REGION_NAMES = {
  easy: '🌏 Asia',
  medium: '🌍 Europe',
  hard: '🌍 Africa',
  expert: '🧠 All Regions',
};

function updateLevel2HUD(){
  const starsEl = document.getElementById('level2-stars');
  const undoEl = document.getElementById('level2-undo-count');
  const levelBadge = document.getElementById('level2-level-badge');

  if(starsEl) starsEl.textContent = level2State.stars;
  if(undoEl) undoEl.textContent = level2State.undoCount;
  if(levelBadge) levelBadge.textContent = LEVEL2_REGION_NAMES[level2State.currentDifficulty] || 'Level 2';
}

function updateLevel2HeartsDisplay(){
  /* Level 2 doesn't have hearts in the top bar, but we track them internally */
}

/* ===== COMPLETE SHELF ANIMATION ===== */
async function completeShelf(shelfIdx){
  playLevel2Sound('complete');

  clearTargetHighlight();

  const shelfEl = document.querySelector(`.level2-shelf[data-shelf="${shelfIdx}"]`);
  if(shelfEl){
    /* Phase 1: Green glow + checkmark */
    shelfEl.classList.add('completed', 'correct-glow');
  }

  /* spawn particles */
  if(shelfEl){
    spawnLevel2Particles(shelfEl, ['✨','🌟','⭐','💫','🎉']);
  }

  level2State.completedShelves++;
  level2State.correctMoves++;
  level2State.totalMoves++;
  level2State.comboCount++;

  /* combo bonus */
  let bonus = 10;
  if(level2State.comboCount >= 3){
    bonus += getComboBonus(level2State.comboCount);
    showComboReward(level2State.comboCount);
  }
  level2State.stars += bonus;
  level2State.earnedCoins += bonus;

  /* celebration message */
  if(shelfEl) showCelebrationMessage(shelfEl);

  /* wait for glow + checkmark to display */
  await sleep(1000);

  /* Phase 2: Slide completed shelf out to the left */
  if(shelfEl){
    shelfEl.classList.add('slide-out-left');
  }
  await sleep(700);

  /* Phase 3: Remove the shelf element */
  if(shelfEl){
    shelfEl.style.display = 'none';
  }

  /* Phase 4: Slide remaining shelves up with stagger */
  const allShelves = document.querySelectorAll('.level2-shelf');
  let delay = 0;
  allShelves.forEach((el)=>{
    if(el.style.display === 'none') return;
    el.style.animation = 'none';
    el.offsetHeight; /* force reflow */
    el.style.animation = `slideUp 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}ms forwards`;
    delay += 100;
  });

  await sleep(400 + delay);

  /* Phase 5: Rebuild shelves and animate new ones from right */
  renderShelves();

  const newShelves = document.querySelectorAll('.level2-shelf');
  newShelves.forEach((el, i)=>{
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = `slideInRight 0.6s cubic-bezier(0.34,1.56,0.64,1) ${i * 80}ms forwards`;
  });

  updateLevel2HUD();

  /* check if all shelves complete */
  if(level2State.completedShelves >= level2State.totalShelves){
    setTimeout(()=>showLevel2Complete(), 800);
  }
}

/* ===== SHOW LEVEL 2 COMPLETE ===== */
function showLevel2Complete(){
  const overlay = document.getElementById('level2-complete-overlay');
  if(overlay){
    document.getElementById('level2-final-stars').textContent = level2State.stars;
    document.getElementById('level2-final-moves').textContent = level2State.moveCount;
    overlay.style.display='flex';
    requestAnimationFrame(()=>overlay.classList.add('show'));
    playLevel2Sound('complete');
    spawnLevel2Particles(overlay, ['🎉','🎊','🏆','⭐','🌟']);
  }
}

/* ===== UTILITY ===== */
function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }

/* ===== START LEVEL 2 ===== */
function startLevel2(difficulty='easy'){
  document.getElementById('stage-select').style.display='none';
  document.getElementById('level2-area').style.display='block';
  initLevel2(difficulty);
}

function backToMenu(){
  document.getElementById('level2-area').style.display='none';
  document.getElementById('level2-complete-overlay').style.display='none';
  showStageSelect();
}
