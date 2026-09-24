class App {
  constructor() {
    this.game = new PuzzleGame();
    this.elements = {};
    this.currentScreen = 'home';
    this.init();
  }

  init() {
    this.cacheElements();
    this.bindEvents();
    this.showScreen('home');
    this.updateUI();
  }

  cacheElements() {
    this.elements = {
      levelTitle: document.getElementById('levelTitle'),
      scoreCount: document.getElementById('scoreCount'),
      puzzleEmoji: document.getElementById('puzzleEmoji'),
      puzzleHint: document.getElementById('puzzleHint'),
      puzzleQuestion: document.getElementById('puzzleQuestion'),
      answerSlots: document.getElementById('answerSlots'),
      keyboard: document.getElementById('keyboard'),
      settingsModal: document.getElementById('settingsModal'),
      menuModal: document.getElementById('menuModal'),
      correctFeedback: document.getElementById('correctFeedback'),
      wrongFeedback: document.getElementById('wrongFeedback'),
      levelSelect: document.getElementById('levelSelect')
    };
  }

  bindEvents() {
    document.getElementById('playBtn').addEventListener('click', () => {
      audioManager.init();
      audioManager.playStart();
      this.startGame();
    });

    document.getElementById('settingsBtn').addEventListener('click', () => {
      audioManager.playPop();
      this.showModal('settingsModal');
    });

    document.getElementById('menuBtn').addEventListener('click', () => {
      audioManager.playPop();
      this.showModal('menuModal');
    });

    document.getElementById('closeSettings').addEventListener('click', () => {
      audioManager.playClick();
      this.hideModal('settingsModal');
    });

    document.getElementById('closeMenu').addEventListener('click', () => {
      audioManager.playClick();
      this.hideModal('menuModal');
    });

    document.getElementById('resetProgress').addEventListener('click', () => {
      if (confirm('Reset all progress?')) {
        audioManager.playClick();
        this.game.state.reset();
        this.hideModal('settingsModal');
        this.updateUI();
      }
    });

    document.addEventListener('keydown', e => {
      if (this.currentScreen !== 'game') return;
      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key) && !e.ctrlKey && !e.metaKey) {
        this.pressKey(key);
      }
    });

    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          audioManager.playClick();
          this.hideModal(overlay.id);
        }
      });
    });
  }

  showScreen(name) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    this.currentScreen = name;

    if (name === 'home') {
      document.getElementById('homeScreen').classList.add('active');
    } else if (name === 'game') {
      document.getElementById('gameScreenWrapper').classList.add('active');
    }
  }

  startGame() {
    this.game.loadPuzzle();
    this.renderPuzzle();
    this.renderKeyboard();
    this.updateUI();
    this.showScreen('game');
  }

  renderPuzzle() {
    const p = this.game.currentPuzzle;
    this.elements.puzzleEmoji.textContent = p.emoji;
    this.elements.puzzleQuestion.textContent = p.question;
    this.elements.puzzleHint.textContent = p.hint;
    this.renderAnswerSlots();
  }

  renderAnswerSlots() {
    const container = this.elements.answerSlots;
    container.innerHTML = '';
    const { answer, revealed } = this.game.currentPuzzle;

    answer.split('').forEach((ch, i) => {
      const div = document.createElement('div');
      div.className = 'slot';

      if (ch === ' ') {
        div.classList.add('space');
        div.innerHTML = '&nbsp;';
      } else if (revealed.includes(i)) {
        div.classList.add('revealed');
        div.textContent = ch;
      } else if (this.game.userGuess[i]) {
        div.classList.add('correct');
        div.textContent = this.game.userGuess[i];
      } else {
        div.classList.add('blank');
        div.textContent = '_';
      }

      div.id = 'slot-' + i;
      container.appendChild(div);
    });
  }

  renderKeyboard() {
    const KB_ROWS = [
      ['Q','W','E','R','T','Y','U','I','O','P'],
      ['A','S','D','F','G','H','J','K','L'],
      ['Z','X','C','V','B','N','M']
    ];

    this.elements.keyboard.innerHTML = '';

    KB_ROWS.forEach(rowLetters => {
      const rowEl = document.createElement('div');
      rowEl.className = 'keyboard-row';

      rowLetters.forEach(letter => {
        const btn = document.createElement('button');
        btn.className = 'key';
        btn.textContent = letter;
        btn.dataset.letter = letter;

        if (this.game.usedKeys.has(letter)) {
          btn.classList.add('used');
        }

        btn.addEventListener('click', () => this.pressKey(letter));
        rowEl.appendChild(btn);
      });

      this.elements.keyboard.appendChild(rowEl);
    });

    const actionRow = document.createElement('div');
    actionRow.className = 'keyboard-row';

    const hintBtn = document.createElement('button');
    hintBtn.className = 'key hint-key';
    hintBtn.textContent = 'Hint (-5)';
    hintBtn.addEventListener('click', () => this.useHint());
    actionRow.appendChild(hintBtn);

    this.elements.keyboard.appendChild(actionRow);
  }

  pressKey(letter) {
    const result = this.game.pressKey(letter);
    if (!result) return;

    if (result.type === 'correct') {
      audioManager.playLetterReveal();
      const slotEl = document.getElementById('slot-' + result.index);
      if (slotEl) {
        slotEl.className = 'slot correct';
        slotEl.textContent = result.letter;
      }
      this.renderKeyboard();

      if (result.win) {
        this.handleWin();
      }
    } else if (result.type === 'wrong') {
      audioManager.playWrong();
      this.updateUI();

      const slotEl = document.getElementById('slot-' + result.index);
      if (slotEl) {
        slotEl.className = 'slot wrong';
        slotEl.textContent = result.letter;
        setTimeout(() => {
          slotEl.className = 'slot blank';
          slotEl.textContent = '_';
        }, 500);
      }
    }
  }

  useHint() {
    audioManager.playHint();
    const result = this.game.useHint();
    if (!result) return;

    this.updateUI();

    if (result.type === 'correct') {
      const slotEl = document.getElementById('slot-' + result.index);
      if (slotEl) {
        slotEl.className = 'slot correct';
        slotEl.textContent = result.letter;
      }
      this.renderKeyboard();

      if (result.win) {
        this.handleWin();
      }
    }
  }

  handleWin() {
    audioManager.playWin();
    this.showFeedback('correct');
    setTimeout(() => {
      audioManager.playLevelComplete();
      this.game.winLevel();
      this.startGame();
    }, 1200);
  }

  updateUI() {
    if (this.currentScreen === 'game') {
      this.elements.levelTitle.textContent = 'Level ' + (this.game.levelIndex + 1);
      this.elements.scoreCount.textContent = this.game.score;
    }
  }

  showFeedback(type) {
    const el = type === 'correct' ? this.elements.correctFeedback : this.elements.wrongFeedback;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), 500);
  }

  showModal(id) {
    audioManager.playPopup();
    document.getElementById(id).classList.add('active');
  }

  hideModal(id) {
    document.getElementById(id).classList.remove('active');
  }
}

let app;
document.addEventListener('DOMContentLoaded', () => {
  app = new App();
});
