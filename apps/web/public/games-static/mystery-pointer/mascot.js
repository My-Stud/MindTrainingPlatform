/* ================================================================
   MOUSE EXPLORER MASCOT — Additive JS for Mystery Pointer Quiz
   ================================================================
   Paste this file AFTER game.js.
   Zero modifications to game.js — this reads the DOM only.
   ================================================================ */

(function () {
    'use strict';

    /* -----------------------------------------------------------
       CONFIG
    ----------------------------------------------------------- */
    var MASCOT_OFFSET_X = 30;
    var MASCOT_OFFSET_Y = 25;
    var WALK_THRESHOLD = 1.5;
    var AMBIENT_COUNT = 8;
    var REWARD_EMOJIS = ['✨', '🌟', '🪙', '⭐', '💫'];
    var REWARD_COUNT = 5;

    /* -----------------------------------------------------------
       STATE
    ----------------------------------------------------------- */
    var mascotEl = null;
    var mascotEmoji = null;
    var rewardContainer = null;
    var gameScreen = null;
    var darkRoom = null;
    var coinEl = null;
    var pointerEl = null;
    var spotX = window.innerWidth / 2;
    var spotY = window.innerHeight / 2;
    var prevX = spotX;
    var prevY = spotY;
    var isMoving = false;
    var gameActive = false;
    var rafId = null;
    var walkTimeout = null;
    var lastCoinsText = '';

    /* -----------------------------------------------------------
       BOOTSTRAP
    ----------------------------------------------------------- */
    function boot() {
        mascotEl = document.getElementById('mouse-mascot');
        mascotEmoji = document.getElementById('mascot-emoji');
        rewardContainer = document.getElementById('reward-burst-container');
        gameScreen = document.getElementById('game-screen');
        darkRoom = document.getElementById('dark-room');
        coinEl = document.getElementById('game-coins');
        pointerEl = document.getElementById('custom-pointer');

        if (!mascotEl || !gameScreen) {
            console.warn('[Mascot] Required elements not found, aborting.');
            return;
        }

        createAmbientParticles();
        observeCoins();
        bindPointer();
        startLoop();

        // Observe game-screen for class changes
        var observer = new MutationObserver(checkGameState);
        observer.observe(gameScreen, { attributes: true, attributeFilter: ['class'] });

        // Also check immediately
        checkGameState();
    }

    function checkGameState() {
        if (!gameScreen || !mascotEl) return;
        var isActive = gameScreen.classList.contains('active');

        if (isActive && !gameActive) {
            gameActive = true;
            mascotEl.style.display = 'block';
        } else if (!isActive && gameActive) {
            gameActive = false;
            mascotEl.style.display = 'none';
        }
    }

    /* -----------------------------------------------------------
       TRACK MOUSE / TOUCH POSITION
    ----------------------------------------------------------- */
    function bindPointer() {
        document.addEventListener('mousemove', function (e) {
            spotX = e.clientX;
            spotY = e.clientY;
        }, { passive: true });
        document.addEventListener('touchmove', function (e) {
            if (e.touches && e.touches.length) {
                spotX = e.touches[0].clientX;
                spotY = e.touches[0].clientY;
            }
        }, { passive: true });
    }

    /* -----------------------------------------------------------
       SMOOTH 60 FPS MASCOT POSITION LOOP
    ----------------------------------------------------------- */
    function startLoop() {
        if (rafId) return;
        rafId = requestAnimationFrame(tick);
    }

    function tick() {
        checkGameState();

        if (gameActive && mascotEl) {
            var mx = spotX + MASCOT_OFFSET_X;
            var my = spotY + MASCOT_OFFSET_Y;
            mascotEl.style.left = mx + 'px';
            mascotEl.style.top = my + 'px';

            var dx = spotX - prevX;
            var dy = spotY - prevY;
            var speed = Math.sqrt(dx * dx + dy * dy);

            if (speed > WALK_THRESHOLD) {
                if (!isMoving) {
                    isMoving = true;
                    mascotEl.classList.add('walking');
                }
                clearTimeout(walkTimeout);
                walkTimeout = setTimeout(stopWalking, 150);
            }
        }

        prevX = spotX;
        prevY = spotY;
        rafId = requestAnimationFrame(tick);
    }

    function stopWalking() {
        isMoving = false;
        if (mascotEl) mascotEl.classList.remove('walking');
    }

    /* -----------------------------------------------------------
       OBSERVE COIN CHANGES — trigger pop animation
    ----------------------------------------------------------- */
    function observeCoins() {
        if (!coinEl) return;

        var observer = new MutationObserver(function () {
            var newText = coinEl.textContent.trim();
            if (newText !== lastCoinsText && lastCoinsText !== '') {
                // Pop the parent stat-item
                var statItem = coinEl.closest('.stat-item');
                if (statItem) {
                    statItem.classList.remove('coin-pop');
                    void statItem.offsetWidth;
                    statItem.classList.add('coin-pop');
                }
            }
            lastCoinsText = newText;
        });

        observer.observe(coinEl, { childList: true, characterData: true, subtree: true });
        lastCoinsText = coinEl.textContent.trim();
    }

    /* -----------------------------------------------------------
       MASCOT REACTIONS
    ----------------------------------------------------------- */
    function mascotReact(type) {
        if (!mascotEl || !mascotEmoji) return;

        mascotEl.classList.remove('react-correct', 'react-incorrect');

        if (type === 'correct') {
            mascotEmoji.textContent = '🐭✨';
            mascotEl.classList.add('react-correct');
            setTimeout(function () {
                mascotEl.classList.remove('react-correct');
                mascotEmoji.textContent = '🐭';
            }, 800);
        } else if (type === 'incorrect') {
            mascotEmoji.textContent = '🐭💫';
            mascotEl.classList.add('react-incorrect');
            setTimeout(function () {
                mascotEl.classList.remove('react-incorrect');
                mascotEmoji.textContent = '🐭';
            }, 600);
        }
    }

    window.mascotReact = mascotReact;

    /* -----------------------------------------------------------
       REWARD BURST — floating emoji particles on correct
    ----------------------------------------------------------- */
    function spawnRewardBurst(x, y) {
        if (!rewardContainer) return;

        for (var i = 0; i < REWARD_COUNT; i++) {
            var particle = document.createElement('span');
            particle.className = 'reward-particle';
            particle.textContent = REWARD_EMOJIS[Math.floor(Math.random() * REWARD_EMOJIS.length)];

            var angle = (Math.PI * 2 / REWARD_COUNT) * i + (Math.random() - 0.5) * 0.5;
            var dist = 40 + Math.random() * 50;
            var rx = Math.cos(angle) * dist;
            var ry = -60 - Math.random() * 40;
            var rr = (Math.random() - 0.5) * 360;

            particle.style.left = x + 'px';
            particle.style.top = y + 'px';
            particle.style.setProperty('--rx', rx + 'px');
            particle.style.setProperty('--ry', ry + 'px');
            particle.style.setProperty('--rr', rr + 'deg');
            particle.style.animationDelay = (i * 0.08) + 's';

            rewardContainer.appendChild(particle);

            (function (el) {
                setTimeout(function () { el.remove(); }, 1100);
            })(particle);
        }
    }

    window.spawnRewardBurst = spawnRewardBurst;

    /* -----------------------------------------------------------
       AMBIENT PARTICLES — faint drifting sparkles
    ----------------------------------------------------------- */
    function createAmbientParticles() {
        if (!darkRoom) return;

        for (var i = 0; i < AMBIENT_COUNT; i++) {
            var p = document.createElement('div');
            p.className = 'mascot-ambient';
            p.style.left = (Math.random() * 100) + '%';
            p.style.bottom = -(5 + Math.random() * 10) + 'px';

            var dur = 15 + Math.random() * 20;
            p.style.animationDuration = dur + 's';
            p.style.animationDelay = (Math.random() * dur) + 's';

            var size = 2 + Math.random() * 2;
            p.style.width = size + 'px';
            p.style.height = size + 'px';

            p.style.setProperty('--dx', ((Math.random() - 0.5) * 40) + 'px');

            var hue = Math.random() > 0.5 ? '45' : '190';
            p.style.background = 'hsla(' + hue + ', 80%, 70%, 0.35)';

            darkRoom.appendChild(p);
        }
    }

    /* -----------------------------------------------------------
       GO
    ----------------------------------------------------------- */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
