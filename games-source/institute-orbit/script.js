document.addEventListener('DOMContentLoaded', async () => {

  // ─── State declarations ────────────────────────────────────
  let questions = [];
  let shuffledQuestions = [];
  let currentQIdx = 0;

  // ─── Load Data ────────────────────────────────────────────
  try {
    const res = await fetch('data.json');
    questions = await res.json();
    shuffleQuestions();
  } catch (e) {
    console.error('Failed to load data.json', e);
    return;
  }


  // ─── DOM ──────────────────────────────────────────────────
  const container = document.getElementById('game-container');
  const stateNameEl = document.getElementById('state-name');
  const playArea = document.getElementById('play-area');
  const balls = [0, 1, 2, 3].map(i => document.getElementById(`ball-${i}`));
  const ballTexts = [0, 1, 2, 3].map(i => document.getElementById(`ball-text-${i}`));
  const optTexts = [0, 1, 2, 3].map(i => document.getElementById(`opt-text-${i}`));
  const optPills = [0, 1, 2, 3].map(i => document.getElementById(`opt-${i}`));

  const joystickContainer = document.getElementById('joystick-container');
  const joystickOuter = document.getElementById('joystick-outer');
  const joystickInner = document.getElementById('joystick-inner');
  const joystickArrow = document.getElementById('joystick-arrow');

  const bulletEl = document.getElementById('bullet');
  const trajSvg = document.getElementById('trajectory-svg');
  const fiftyBtn = document.getElementById('fifty-fifty-btn');
  const hintBtn = document.getElementById('hint-btn');
  const hintModal = document.getElementById('hint-modal');
  const hintText = document.getElementById('hint-text');
  const closeHint = document.getElementById('close-hint');
  const toast = document.getElementById('toast');
  const skipBtn = document.getElementById('skip-btn');
  const pauseBtn = document.getElementById('pause-btn');
  const pauseOverlay = document.getElementById('pause-overlay');
  const scoreEl = document.getElementById('score-value');

  // ─── State ────────────────────────────────────────────────
  let currentQuestion = null;
  let currentOptions = [];
  let isShooting = false;
  let isPaused = false;
  let isAiming = false;
  let animFrame = null;
  let currentAngleRad = 0;
  let currentDragDist = 0;
  let points = 0;

  let maxDragDist = 45;
  let joystickCenterX = 0;
  let joystickCenterY = 0;
  // Fixed positions for the 4 option balls around the center (diagonals)
  const BALL_POSITIONS = [
    { x: 0.22, y: 0.22 }, // Top-Left
    { x: 0.78, y: 0.22 }, // Top-Right
    { x: 0.22, y: 0.78 }, // Bottom-Left
    { x: 0.78, y: 0.78 }  // Bottom-Right
  ];

  // ─── Init ─────────────────────────────────────────────────
  computeJoystickCenter();
  window.addEventListener('resize', () => {
    computeJoystickCenter();
    adjustBallPositions();
  });

  // Set initial score display to 0 points
  scoreEl.textContent = points;
  loadNextQuestion();

  // Helper to shuffle the questions list
  function shuffleQuestions() {
    shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    currentQIdx = 0;
  }

  // ─── Joystick center calculation ──────────────────────────
  function computeJoystickCenter() {
    const rect = joystickOuter.getBoundingClientRect();
    const cRect = container.getBoundingClientRect();
    joystickCenterX = rect.left + rect.width / 2 - cRect.left;
    joystickCenterY = rect.top + rect.height / 2 - cRect.top;
    maxDragDist = rect.width * 0.375;
  }

  // Helper to adjust balls if container size changes
  function adjustBallPositions() {
    const paRect = playArea.getBoundingClientRect();
    balls.forEach((ball, i) => {
      if (ball && !ball.classList.contains('hidden')) {
        const ballW = ball.offsetWidth || 80;
        const posX = BALL_POSITIONS[i].x * paRect.width - ballW / 2;
        const posY = BALL_POSITIONS[i].y * paRect.height - ballW / 2;
        ball.style.left = `${posX}px`;
        ball.style.top = `${posY}px`;
      }
    });
  }

  // ─── Dragging / Aiming Logic ──────────────────────────────
  joystickInner.addEventListener('mousedown', onDragStart);
  joystickInner.addEventListener('touchstart', (e) => {
    e.preventDefault();
    onDragStart(e.touches[0]);
  }, { passive: false });

  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('touchmove', (e) => {
    if (isAiming) {
      e.preventDefault();
      onDragMove(e.touches[0]);
    }
  }, { passive: false });

  window.addEventListener('mouseup', onDragRelease);
  window.addEventListener('touchend', (e) => {
    if (isAiming) {
      e.preventDefault();
      onDragRelease(e.changedTouches[0]);
    }
  }, { passive: false });

  window.addEventListener('mouseleave', () => {
    if (isAiming) {
      onDragRelease();
    }
  });

  function onDragStart(e) {
    if (isShooting || isPaused) return;
    computeJoystickCenter();
    isAiming = true;
    joystickContainer.classList.add('active');
    updateJoystickDrag(e);
  }

  function onDragMove(e) {
    if (!isAiming || isShooting || isPaused) return;
    updateJoystickDrag(e);
  }

  function onDragRelease() {
    if (!isAiming) return;
    isAiming = false;
    joystickContainer.classList.remove('active');
    joystickInner.style.transform = 'translate(0px, 0px)';
    clearTrajectory();

    if (isShooting || isPaused) return;

    // Only fire if the player dragged the puck far enough to aim deliberately
    if (currentDragDist > 10) {
      fireBullet(joystickCenterX, joystickCenterY, currentAngleRad);
    }
  }

  function updateJoystickDrag(e) {
    const cRect = container.getBoundingClientRect();
    const mx = e.clientX - cRect.left;
    const my = e.clientY - cRect.top;
    let dx = mx - joystickCenterX;
    let dy = my - joystickCenterY;
    let dist = Math.hypot(dx, dy);

    if (dist > maxDragDist) {
      dx = (dx / dist) * maxDragDist;
      dy = (dy / dist) * maxDragDist;
      dist = maxDragDist;
    }

    currentDragDist = dist;
    currentAngleRad = Math.atan2(dy, dx);

    // Translate puck visually
    joystickInner.style.transform = `translate(${dx}px, ${dy}px)`;

    // Rotate arrow (base direction points UP, standard Math.atan2(dy, dx) points RIGHT (0 rad))
    // To align properly, we add PI/2 to rotate the pointer correctly
    const angleDeg = (currentAngleRad + Math.PI / 2) * (180 / Math.PI);
    joystickArrow.style.transform = `translateX(-50%) rotate(${angleDeg}deg)`;

    // Draw prediction trail
    drawTrajectory(joystickCenterX, joystickCenterY, currentAngleRad);
  }

  // ─── Trajectory ───────────────────────────────────────────
  function drawTrajectory(ox, oy, angleRad) {
    // No-op: Removed aiming lines per user feedback
  }

  function clearTrajectory() {
    // No-op
  }


  // ─── Fire Bullet ──────────────────────────────────────────
  function fireBullet(startX, startY, angleRad) {
    isShooting = true;
    balls.forEach(b => b.classList.remove('floating'));

    const cRect = container.getBoundingClientRect();
    const paRect = playArea.getBoundingClientRect();
    const wallLeft = paRect.left - cRect.left;
    const wallRight = paRect.right - cRect.left;
    const wallTop = paRect.top - cRect.top + 6;
    const wallBottom = paRect.bottom - cRect.top;

    const SPEED = 11;
    let vx = Math.cos(angleRad) * SPEED;
    let vy = Math.sin(angleRad) * SPEED;
    const R = 8; // Bullet radius

    if (bulletEl.parentElement !== container) {
      container.appendChild(bulletEl);
    }

    let bx = startX - R, by = startY - R;
    bulletEl.style.left = bx + 'px';
    bulletEl.style.top = by + 'px';
    bulletEl.style.position = 'absolute';
    bulletEl.classList.remove('hidden');

    let bulletStepCount = 0;

    function step() {
      bx += vx;
      by += vy;

      // Bounce off walls
      if (bx < wallLeft) { bx = wallLeft; vx = Math.abs(vx); }
      if (bx > wallRight - R * 2) { bx = wallRight - R * 2; vx = -Math.abs(vx); }
      if (by < wallTop) { by = wallTop; vy = Math.abs(vy); }
      if (by > wallBottom - R * 2) { by = wallBottom - R * 2; vy = -Math.abs(vy); }

      bulletEl.style.left = bx + 'px';
      bulletEl.style.top = by + 'px';

      const bcx = bx + R, bcy = by + R;

      // Collision check with options
      for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        if (ball.classList.contains('hidden')) continue;
        const br = ball.getBoundingClientRect();
        const ballCX = br.left + br.width / 2 - cRect.left;
        const ballCY = br.top + br.height / 2 - cRect.top;

        const ballRadius = br.width / 2;
        if (Math.hypot(bcx - ballCX, bcy - ballCY) < ballRadius + R + 2) {
          endBullet(true);
          checkAnswer(i, ball, ballCX, ballCY);
          return;
        }
      }

      // Safeguard against infinite bouncing
      bulletStepCount++;
      if (bulletStepCount > 400) {
        endBullet(false);
        return;
      }

      animFrame = requestAnimationFrame(step);
    }
    animFrame = requestAnimationFrame(step);
  }

  function endBullet(hit) {
    bulletEl.classList.add('hidden');
    if (!hit) {
      isShooting = false;
      showToast('💨 Miss!', 'error');
      balls.forEach(b => {
        if (!b.classList.contains('hidden')) b.classList.add('floating');
      });
    }
  }

  // ─── Check Answer ─────────────────────────────────────────
  function checkAnswer(index, ball, ballCX, ballCY) {
    const correct = currentOptions[index] === currentQuestion.location;

    if (correct) {
      points += 100;
      scoreEl.textContent = points;
      scoreEl.classList.remove('bump');
      void scoreEl.offsetWidth;
      scoreEl.classList.add('bump');

      ball.classList.remove('floating');
      ball.classList.add('popping');
      spawnConfetti(ballCX, ballCY);
      showToast('🎉 Correct! +100', 'success');
    } else {
      triggerJoystickShake();
      points = Math.max(0, points - 10);
      scoreEl.textContent = points;
      scoreEl.classList.remove('bump');
      void scoreEl.offsetWidth;
      scoreEl.classList.add('bump');

      ball.classList.remove('floating');

      // Scatter exit direction
      const exitClasses = ['exit-left', 'exit-right', 'exit-up'];
      ball.classList.add(exitClasses[index % 3]);
      optPills[index].classList.add('removed');
      showToast('❌ Incorrect! -10', 'error');
    }

    setTimeout(loadNextQuestion, 1300);
  }

  function triggerJoystickShake() {
    joystickOuter.classList.remove('joystick-shake');
    void joystickOuter.offsetWidth;
    joystickOuter.classList.add('joystick-shake');
    joystickOuter.addEventListener('animationend', () => {
      joystickOuter.classList.remove('joystick-shake');
    }, { once: true });
  }

  // ─── Confetti burst ───────────────────────────────────────
  const CONFETTI_COLORS = ['#ffd43b', '#ff6b6b', '#69db7c', '#74c0fc', '#f06595', '#fff', '#a9e34b'];
  function spawnConfetti(cx, cy) {
    if (typeof confetti === 'function') {
      const cRect = container.getBoundingClientRect();
      const originX = (cx + cRect.left) / window.innerWidth;
      const originY = (cy + cRect.top) / window.innerHeight;

      const count = 150;
      const defaults = {
        origin: { x: originX, y: originY },
        colors: CONFETTI_COLORS,
        zIndex: 9999,
        scalar: 1.2,
        disableForReducedMotion: true
      };

      function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 45 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 40 });
    }
  }

  // ─── Load Question ────────────────────────────────────────
  function loadNextQuestion() {
    cancelAnimationFrame(animFrame);
    isShooting = false;
    isAiming = false;
    fiftyBtn.disabled = false;
    clearTrajectory();
    bulletEl.classList.add('hidden');

    // Scatter remaining visible balls out before loading new question
    balls.forEach((ball, i) => {
      if (!ball.classList.contains('hidden') &&
        !ball.classList.contains('popping') &&
        !ball.classList.contains('exit-left') &&
        !ball.classList.contains('exit-right') &&
        !ball.classList.contains('exit-up')) {
        ball.classList.remove('floating');
        const exits = ['exit-left', 'exit-right', 'exit-up'];
        ball.classList.add(exits[i % 3]);
      }
    });

    // After exit animation, load new question
    setTimeout(() => {
      if (questions.length === 0) return;

      if (currentQIdx >= shuffledQuestions.length) {
        shuffleQuestions();
      }

      currentQuestion = shuffledQuestions[currentQIdx];
      currentQIdx++;

      // Question text entrance
      stateNameEl.classList.remove('question-entering');
      void stateNameEl.offsetWidth;
      stateNameEl.classList.add('question-entering');
      stateNameEl.textContent = currentQuestion.institute + ' ?';

      // 3 unique wrong options
      const wrong = [];
      while (wrong.length < 3) {
        const rq = questions[Math.floor(Math.random() * questions.length)];
        if (rq.location !== currentQuestion.location && !wrong.includes(rq.location)) {
          wrong.push(rq.location);
        }
      }
      currentOptions = [currentQuestion.location, ...wrong].sort(() => Math.random() - 0.5);

      // Update pills
      optTexts.forEach((el, i) => el.textContent = currentOptions[i]);
      optPills.forEach((p, i) => {
        p.classList.remove('removed', 'entering');
        void p.offsetWidth;
        p.style.animationDelay = `${i * 0.07}s`;
        p.classList.add('entering');
        p.addEventListener('animationend', () => {
          p.classList.remove('entering');
          p.style.animationDelay = '';
        }, { once: true });
      });

      const paRect = playArea.getBoundingClientRect();

      // Staggered ball entrance
      balls.forEach((ball, i) => {
        ball.className = `ball ${['color-red', 'color-green', 'color-gold', 'color-blue'][i]}`;
        ball.style.opacity = '';
        ball.style.animation = '';

        // Calculate position relative to container dimensions
        const ballW = ball.offsetWidth || 80;
        const posX = BALL_POSITIONS[i].x * paRect.width - ballW / 2;
        const posY = BALL_POSITIONS[i].y * paRect.height - ballW / 2;
        ball.style.left = `${posX}px`;
        ball.style.top = `${posY}px`;

        ball.style.animationDelay = `${i * 0.08}s`;
        ballTexts[i].textContent = currentOptions[i];

        setTimeout(() => {
          ball.classList.add('entering');
          ball.addEventListener('animationend', () => {
            ball.classList.remove('entering');
            ball.style.animationDelay = `${(Math.random() * 1.5).toFixed(2)}s`;
            ball.classList.add('floating');
          }, { once: true });
        }, i * 80);
      });
    }, 480); // Wait for exit animations to finish
  }

  // ─── Toast ────────────────────────────────────────────────
  let toastTimer = null;
  function showToast(msg, type) {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 1200);
  }

  // ─── 50/50 ────────────────────────────────────────────────
  function useFiftyFifty() {
    if (fiftyBtn.disabled || isShooting) return;
    fiftyBtn.disabled = true;
    const wrongIdx = currentOptions
      .map((o, i) => o !== currentQuestion.location ? i : -1)
      .filter(i => i !== -1)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    wrongIdx.forEach(i => {
      balls[i].classList.remove('floating');
      const exits = ['exit-left', 'exit-right', 'exit-up'];
      balls[i].classList.add(exits[i % 3]);
      optPills[i].classList.add('removed');
      balls[i].addEventListener('animationend', () => {
        balls[i].classList.add('hidden');
      }, { once: true });
    });
  }

  // ─── Buttons & Event Listeners ───────────────────────────
  fiftyBtn.addEventListener('click', useFiftyFifty);

  hintBtn.addEventListener('click', () => {
    if (!currentQuestion) return;
    hintText.textContent = currentQuestion.mnemonic;
    hintModal.classList.remove('hidden');
  });

  closeHint.addEventListener('click', () => hintModal.classList.add('hidden'));

  skipBtn.addEventListener('click', () => {
    if (isShooting || isAiming || isPaused) return;
    cancelAnimationFrame(animFrame);
    isShooting = false;
    isAiming = false;
    // Mild penalty for skipping
    points = Math.max(0, points - 5);
    scoreEl.textContent = points;
    bulletEl.classList.add('hidden');
    clearTrajectory();
    loadNextQuestion();
  });

  function togglePause() {
    isPaused = !isPaused;
    pauseOverlay.classList.toggle('hidden', !isPaused);
    pauseBtn.querySelector('span').textContent = isPaused ? '▶' : '⏸';
    if (!isPaused && !isShooting) {
      balls.forEach(b => {
        if (!b.classList.contains('hidden')) b.classList.add('floating');
      });
    }
  }

  pauseBtn.addEventListener('click', togglePause);
  pauseOverlay.addEventListener('click', () => {
    if (isPaused) togglePause();
  });
});
