class MysteryPointerQuiz {
    constructor() {
        this.currentLevel = 1;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.answered = false;
        this.paused = false;
        this.pointerX = window.innerWidth / 2;
        this.pointerY = window.innerHeight / 2;
        this.targetX = this.pointerX;
        this.targetY = this.pointerY;
        this.spotlightRadius = 250;
        this.optionPositions = [];
        this.unlockedLevels = TOTAL_LEVELS;
        this.totalCoins = parseInt(localStorage.getItem('mpq_coins')) || 0;
        this.levelStars = JSON.parse(localStorage.getItem('mpq_stars')) || {};
        this.audioCtx = null;
        this.ambientOsc = null;
        this.ambientGainNode = null;
        this.moveAnimFrame = null;
        this.init();
    }
    init() {
        this.cacheElements();
        this.setupEventListeners();
        this.updateMenuCoins();
        this.buildLevelGrid();
        // Show menu spotlight on load
        if (this.menuSpotlight) {
            this.menuSpotlight.classList.add('visible');
        }
        this.pointer.style.opacity = '1';
    }
    cacheElements() {
        this.screens = {
            menu: document.getElementById('menu-screen'),
            levels: document.getElementById('level-screen'),
            howto: document.getElementById('howto-screen'),
            game: document.getElementById('game-screen'),
            results: document.getElementById('results-screen')
        };
        this.pointer = document.getElementById('custom-pointer');
        this.menuSpotlight = document.getElementById('menu-spotlight');
        this.darkRoom = document.getElementById('dark-room');
        this.spotlightLayer = document.getElementById('spotlight-layer');
        this.questionText = document.getElementById('question-text');
        this.questionCounter = document.getElementById('question-counter');
        this.gameCoins = document.getElementById('game-coins');
        this.gameScore = document.getElementById('game-score');
        this.progressBar = document.getElementById('progress-bar');
        this.feedbackOverlay = document.getElementById('feedback-overlay');
        this.feedbackContent = document.getElementById('feedback-content');
        this.pauseMenu = document.getElementById('pause-menu');
        this.levelsGrid = document.getElementById('levels-grid');
        this.answerOptions = [
            document.getElementById('answer-0'),
            document.getElementById('answer-1'),
            document.getElementById('answer-2'),
            document.getElementById('answer-3')
        ];
        this.hintMnemonic = document.getElementById('hint-mnemonic');
    }
    setupEventListeners() {
        const bindBtn = (id, handler) => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('click', handler);
                el.addEventListener('touchend', (e) => { e.preventDefault(); handler(); });
            }
        };
        bindBtn('play-btn', () => this.startLevel(this.currentLevel));
        bindBtn('levels-btn', () => this.showScreen('levels'));
        bindBtn('how-to-play-btn', () => this.showScreen('howto'));
        bindBtn('level-back-btn', () => this.showScreen('menu'));
        bindBtn('howto-back-btn', () => this.showScreen('menu'));
        bindBtn('pause-btn', () => this.togglePause());
        bindBtn('resume-btn', () => this.togglePause());
        bindBtn('quit-btn', () => this.quitToMenu());
        bindBtn('replay-btn', () => this.startLevel(this.currentLevel));
        bindBtn('next-level-btn', () => this.nextLevel());
        bindBtn('home-btn', () => this.showScreen('menu'));
        document.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
        document.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.onPointerMove(touch.clientX, touch.clientY);
        }, { passive: false });
        document.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            this.onPointerMove(touch.clientX, touch.clientY);
        });
        this.answerOptions.forEach((opt, index) => {
            opt.addEventListener('click', () => this.selectAnswer(index));
            opt.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.selectAnswer(index);
            });
        });
        this.updatePointerPosition(this.pointerX, this.pointerY);
        window.addEventListener('resize', () => {
            if (this.screens.game.classList.contains('active') && !this.answered) {
                this.loadQuestion();
            }
        });
    }
    setupAudio() {
        try {
            if (!this.audioCtx) {
                this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            }
        } catch (e) {}
    }
    playSound(type) {
        this.setupAudio();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);
        const now = this.audioCtx.currentTime;
        switch (type) {
            case 'correct':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(523.25, now);
                osc.frequency.setValueAtTime(659.25, now + 0.1);
                osc.frequency.setValueAtTime(783.99, now + 0.2);
                gain.gain.setValueAtTime(0.3, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
                osc.start(now); osc.stop(now + 0.4); break;
            case 'wrong':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(200, now);
                osc.frequency.setValueAtTime(150, now + 0.15);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now); osc.stop(now + 0.3); break;
            case 'click':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now); osc.stop(now + 0.1); break;
            case 'reveal':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.linearRampToValueAtTime(600, now + 0.15);
                gain.gain.setValueAtTime(0.08, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                osc.start(now); osc.stop(now + 0.2); break;
            case 'levelup':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(440, now);
                osc.frequency.setValueAtTime(554.37, now + 0.15);
                osc.frequency.setValueAtTime(659.25, now + 0.3);
                osc.frequency.setValueAtTime(880, now + 0.45);
                gain.gain.setValueAtTime(0.25, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
                osc.start(now); osc.stop(now + 0.7); break;
            case 'ambient':
                osc.type = 'sine';
                osc.frequency.value = 60;
                gain.gain.value = 0.04;
                this.ambientOsc = osc;
                this.ambientGainNode = gain;
                osc.start(now); break;
        }
    }
    startAmbient() {
        this.stopAmbient();
        this.setupAudio();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        this.playSound('ambient');
    }
    stopAmbient() {
        if (this.ambientOsc) {
            try { this.ambientOsc.stop(); } catch (e) {}
            this.ambientOsc = null;
        }
    }
    showScreen(name) {
        Object.values(this.screens).forEach(s => s.classList.remove('active'));
        this.screens[name].classList.add('active');
        // Show/hide menu spotlight
        if (this.menuSpotlight) {
            this.menuSpotlight.classList.toggle('visible', name === 'menu');
        }
        // Show pointer on all screens (always visible)
        this.pointer.style.opacity = '1';
        this.playSound('click');
    }
    startLevel(level) {
        this.currentLevel = level;
        this.currentQuestion = 0;
        this.score = 0;
        this.correctAnswers = 0;
        this.answered = false;
        this.paused = false;
        this.setDifficulty(level);
        this.showScreen('game');
        this.startAmbient();
        this.loadQuestion();
    }
    setDifficulty(level) {
        if (level <= 2) this.spotlightRadius = 280;
        else if (level <= 4) this.spotlightRadius = 230;
        else if (level <= 6) this.spotlightRadius = 200;
        else if (level <= 8) this.spotlightRadius = 170;
        else this.spotlightRadius = 150;
        this.updateSpotlight();
    }
    loadQuestion() {
        if (this.currentQuestion >= QUESTIONS_PER_LEVEL) { this.showResults(); return; }
        this.answered = false;
        const q = QUESTIONS[this.currentLevel][this.currentQuestion];
        this.hintMnemonic.textContent = q.hint;
        this.questionText.textContent = q.question;
        this.questionCounter.textContent = 'QUESTION ' + (this.currentQuestion + 1) + ' / ' + QUESTIONS_PER_LEVEL;
        this.gameCoins.textContent = this.totalCoins;
        this.gameScore.textContent = this.score;
        this.progressBar.style.width = ((this.currentQuestion / QUESTIONS_PER_LEVEL) * 100) + '%';
        this.placeAnswers(q.options);
        this.questionText.parentElement.style.animation = 'none';
        void this.questionText.parentElement.offsetWidth;
        this.questionText.parentElement.style.animation = 'question-appear 0.5s ease';
    }
    placeAnswers(options) {
        var w = window.innerWidth;
        var h = window.innerHeight;
        var padX = Math.max(60, w * 0.08);
        var padTop = 220;
        var padBot = 100;
        var midX = w / 2;
        var midY = (padTop + h - padBot) / 2;
        var spreadX = w * 0.35;
        var spreadY = (h - padTop - padBot) * 0.35;
        var centers = [
            { x: midX - spreadX, y: midY - spreadY },
            { x: midX + spreadX, y: midY - spreadY },
            { x: midX - spreadX, y: midY + spreadY },
            { x: midX + spreadX, y: midY + spreadY }
        ];
        centers.forEach(c => {
            c.x = Math.max(padX + 70, Math.min(w - padX - 70, c.x + (Math.random() - 0.5) * 40));
            c.y = Math.max(padTop + 50, Math.min(h - padBot - 50, c.y + (Math.random() - 0.5) * 30));
        });
        this.optionPositions = centers;
        this.answerOptions.forEach((opt, i) => {
            opt.querySelector('.answer-text').textContent = options[i];
            opt.style.left = (centers[i].x - 75) + 'px';
            opt.style.top = (centers[i].y - 28) + 'px';
            opt.classList.remove('illuminated', 'correct', 'wrong', 'disabled');
            opt.style.opacity = '0.12';
            opt.style.transform = 'scale(0.9)';
            opt.style.pointerEvents = 'auto';
        });
    }
    onPointerMove(x, y) {
        this.targetX = x;
        this.targetY = y;
        if (!this.paused) this.startSmoothMove();
    }
    startSmoothMove() {
        if (this.moveAnimFrame) cancelAnimationFrame(this.moveAnimFrame);
        var self = this;
        function tick() {
            var dx = self.targetX - self.pointerX;
            var dy = self.targetY - self.pointerY;
            if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
                self.pointerX = self.targetX;
                self.pointerY = self.targetY;
                self.updatePointerPosition(self.pointerX, self.pointerY);
                self.checkIllumination();
                return;
            }
            self.pointerX += dx * 0.18;
            self.pointerY += dy * 0.18;
            self.updatePointerPosition(self.pointerX, self.pointerY);
            self.checkIllumination();
            self.moveAnimFrame = requestAnimationFrame(tick);
        }
        tick();
    }
    updatePointerPosition(x, y) {
        this.pointer.style.left = x + 'px';
        this.pointer.style.top = y + 'px';
        this.spotlightLayer.style.setProperty('--mouse-x', x + 'px');
        this.spotlightLayer.style.setProperty('--mouse-y', y + 'px');
        // Update menu spotlight position
        if (this.menuSpotlight) {
            this.menuSpotlight.style.setProperty('--spot-x', x + 'px');
            this.menuSpotlight.style.setProperty('--spot-y', y + 'px');
        }
    }
    updateSpotlight() {
        var r = this.spotlightRadius;
        this.spotlightLayer.style.background =
            'radial-gradient(circle ' + r + 'px at var(--mouse-x, 50%) var(--mouse-y, 50%), ' +
            'transparent 0%, transparent 40%, rgba(5,7,8,0.5) 60%, rgba(5,7,8,0.92) 85%)';
    }
    checkIllumination() {
        if (this.answered) return;
        var self = this;
        this.answerOptions.forEach(function (opt) {
            if (opt.classList.contains('disabled')) return;
            var rect = opt.getBoundingClientRect();
            var cx = rect.left + rect.width / 2;
            var cy = rect.top + rect.height / 2;
            var dist = Math.hypot(self.pointerX - cx, self.pointerY - cy);
            var threshold = self.spotlightRadius * 0.85;
            if (dist < threshold) {
                var intensity = 1 - (dist / threshold);
                opt.style.opacity = (0.15 + intensity * 0.85).toString();
                opt.style.transform = 'scale(' + (0.9 + intensity * 0.15) + ')';
                if (intensity > 0.3 && !opt.classList.contains('illuminated')) {
                    opt.classList.add('illuminated');
                    self.playSound('reveal');
                }
            } else {
                opt.classList.remove('illuminated');
                opt.style.opacity = '0.12';
                opt.style.transform = 'scale(0.9)';
            }
        });
    }
    selectAnswer(index) {
        if (this.answered || this.paused) return;
        var q = QUESTIONS[this.currentLevel][this.currentQuestion];
        var isCorrect = index === q.correct;
        this.answered = true;
        var self = this;
        this.answerOptions.forEach(function (opt) {
            opt.classList.add('disabled');
            opt.style.pointerEvents = 'none';
        });
        if (isCorrect) {
            this.answerOptions[index].classList.add('correct');
            this.answerOptions[index].style.opacity = '1';
            this.score += 10;
            this.correctAnswers++;
            this.totalCoins += 10;
            localStorage.setItem('mpq_coins', this.totalCoins);
            this.gameCoins.textContent = this.totalCoins;
            this.gameScore.textContent = this.score;
            this.showFeedback(true);
            this.playSound('correct');
            if (window.mascotReact) window.mascotReact('correct');
            if (window.spawnRewardBurst) window.spawnRewardBurst(this.pointerX, this.pointerY);
        } else {
            this.answerOptions[index].classList.add('wrong');
            this.answerOptions[index].style.opacity = '1';
            this.answerOptions[q.correct].classList.add('correct');
            this.answerOptions[q.correct].style.opacity = '1';
            this.showFeedback(false);
            this.playSound('wrong');
            if (window.mascotReact) window.mascotReact('incorrect');
        }
        setTimeout(function () {
            self.feedbackOverlay.classList.remove('show');
            self.currentQuestion++;
            self.loadQuestion();
        }, 2200);
    }
    showFeedback(correct) {
        var q = QUESTIONS[this.currentLevel][this.currentQuestion];
        var text = this.feedbackContent.querySelector('.feedback-text');
        var bonus = this.feedbackContent.querySelector('.feedback-bonus');
        text.textContent = correct ? 'CORRECT!' : 'WRONG!';
        text.className = 'feedback-text ' + (correct ? 'correct' : 'wrong');
        if (correct) {
            bonus.textContent = q.word + ' = ' + q.options[q.correct] + '  +10 Coins';
        } else {
            bonus.textContent = q.word + ' = ' + q.options[q.correct];
        }
        this.feedbackOverlay.classList.add('show');
    }
    togglePause() {
        this.paused = !this.paused;
        this.pauseMenu.classList.toggle('show', this.paused);
        this.pointer.style.opacity = this.paused ? '0.3' : '1';
    }
    quitToMenu() {
        this.stopAmbient();
        this.paused = false;
        this.pauseMenu.classList.remove('show');
        this.pointer.style.opacity = '1';
        this.showScreen('menu');
    }
    showResults() {
        this.stopAmbient();
        this.pointer.style.opacity = '1';
        var accuracy = Math.round((this.correctAnswers / QUESTIONS_PER_LEVEL) * 100);
        var stars = 0;
        if (accuracy >= 30) stars = 1;
        if (accuracy >= 60) stars = 2;
        if (accuracy >= 80) stars = 3;
        var prevStars = this.levelStars[this.currentLevel] || 0;
        if (stars > prevStars) {
            this.levelStars[this.currentLevel] = stars;
            localStorage.setItem('mpq_stars', JSON.stringify(this.levelStars));
        }
        if (this.currentLevel >= this.unlockedLevels && this.currentLevel < TOTAL_LEVELS) {
            this.unlockedLevels = this.currentLevel + 1;
            localStorage.setItem('mpq_levels', this.unlockedLevels);
        }
        document.getElementById('final-score').textContent = this.score;
        document.getElementById('final-coins').textContent = '+' + (this.correctAnswers * 10);
        document.getElementById('final-correct').textContent = this.correctAnswers + '/' + QUESTIONS_PER_LEVEL;
        document.getElementById('final-accuracy').textContent = accuracy + '%';
        var starElements = document.querySelectorAll('#results-stars .star');
        starElements.forEach(function (star, i) {
            star.classList.remove('active');
            setTimeout(function () {
                if (i < stars) star.classList.add('active');
            }, 300 + i * 400);
        });
        document.getElementById('results-title').textContent =
            accuracy >= 80 ? 'AMAZING!' : accuracy >= 60 ? 'GREAT JOB!' : accuracy >= 40 ? 'GOOD TRY!' : 'KEEP PRACTICING!';
        var nextBtn = document.getElementById('next-level-btn');
        nextBtn.style.display = this.currentLevel >= TOTAL_LEVELS ? 'none' : 'flex';
        this.progressBar.style.width = '100%';
        this.showScreen('results');
        this.playSound('levelup');
        this.buildLevelGrid();
        this.updateMenuCoins();
    }
    nextLevel() {
        if (this.currentLevel < TOTAL_LEVELS) {
            this.startLevel(this.currentLevel + 1);
        }
    }
    buildLevelGrid() {
        this.levelsGrid.innerHTML = '';
        for (var i = 1; i <= TOTAL_LEVELS; i++) {
            var card = document.createElement('div');
            card.className = 'level-card';
            var stars = this.levelStars[i] || 0;
            var isCompleted = stars > 0;
            if (isCompleted) card.classList.add('completed');
            var numDiv = document.createElement('div');
            numDiv.className = 'level-number';
            numDiv.textContent = i;
            card.appendChild(numDiv);
            var labelDiv = document.createElement('div');
            labelDiv.className = 'level-label';
            labelDiv.textContent = LEVEL_NAMES[i] || 'Level ' + i;
            card.appendChild(labelDiv);
            var starsDiv = document.createElement('div');
            starsDiv.className = 'level-stars';
            for (var s = 0; s < 3; s++) {
                var starSpan = document.createElement('span');
                starSpan.className = 'star' + (s < stars ? '' : ' empty');
                starSpan.textContent = '\u2605';
                starsDiv.appendChild(starSpan);
            }
            card.appendChild(starsDiv);
            var levelNum = i;
            card.addEventListener('click', (function (ln) {
                return function () {
                    game.startLevel(ln);
                };
            })(levelNum));
            this.levelsGrid.appendChild(card);
        }
    }
    updateMenuCoins() {
        document.getElementById('menu-coins').textContent = this.totalCoins;
    }
}
var game;
document.addEventListener('DOMContentLoaded', function () {
    game = new MysteryPointerQuiz();
});
