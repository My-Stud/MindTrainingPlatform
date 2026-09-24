class GameState {
  constructor() {
    this.load();
  }

  get defaults() {
    return {
      levelIndex: 0,
      score: 0,
      lives: 3,
      soundEnabled: true
    };
  }

  load() {
    try {
      const saved = localStorage.getItem('picwordState');
      if (saved) {
        this.data = { ...this.defaults, ...JSON.parse(saved) };
      } else {
        this.data = { ...this.defaults };
      }
    } catch {
      this.data = { ...this.defaults };
    }
  }

  save() {
    try {
      localStorage.setItem('picwordState', JSON.stringify(this.data));
    } catch {}
  }

  get(key) { return this.data[key]; }
  set(key, val) { this.data[key] = val; this.save(); }

  reset() {
    this.data = { ...this.defaults };
    this.save();
  }
}

class PuzzleGame {
  constructor() {
    this.state = new GameState();
    this.currentPuzzle = null;
    this.userGuess = [];
    this.usedKeys = new Set();
    this.wrongCount = 0;
    this.ptsEarned = 10;
  }

  get levelIndex() { return this.state.get('levelIndex'); }
  get score() { return this.state.get('score'); }
  get lives() { return this.state.get('lives'); }

  loadPuzzle() {
    this.currentPuzzle = PUZZLES[this.levelIndex % PUZZLES.length];
    const { answer, revealed } = this.currentPuzzle;

    this.userGuess = answer.split('').map((ch, i) =>
      (ch === ' ' || revealed.includes(i)) ? ch : null
    );
    this.usedKeys = new Set();
    this.wrongCount = 0;
    this.ptsEarned = 10;
  }

  nextBlankIndex() {
    const { answer, revealed } = this.currentPuzzle;
    return answer.split('').findIndex((ch, i) =>
      ch !== ' ' && !revealed.includes(i) && !this.userGuess[i]
    );
  }

  pressKey(letter) {
    const idx = this.nextBlankIndex();
    if (idx === -1) return null;

    if (this.currentPuzzle.answer[idx] === letter) {
      this.userGuess[idx] = letter;
      this.usedKeys.add(letter);

      if (this.checkWin()) {
        return { type: 'correct', index: idx, letter, win: true };
      }
      return { type: 'correct', index: idx, letter, win: false };
    } else {
      this.wrongCount++;
      this.ptsEarned = Math.max(0, this.ptsEarned - 1);
      return { type: 'wrong', index: idx, letter };
    }
  }

  useHint() {
    const idx = this.nextBlankIndex();
    if (idx === -1) return null;

    this.state.set('score', Math.max(0, this.score - 5));
    this.ptsEarned = Math.max(0, this.ptsEarned - 5);

    const correctLetter = this.currentPuzzle.answer[idx];
    return this.pressKey(correctLetter);
  }

  clearGuess() {
    const { answer, revealed } = this.currentPuzzle;
    this.userGuess = answer.split('').map((ch, i) =>
      (ch === ' ' || revealed.includes(i)) ? ch : null
    );
    this.usedKeys = new Set();
  }

  checkWin() {
    const { answer, revealed } = this.currentPuzzle;
    return answer.split('').every((ch, i) =>
      ch === ' ' || revealed.includes(i) || this.userGuess[i] === ch
    );
  }

  winLevel() {
    this.state.set('score', this.score + this.ptsEarned);
    this.state.set('levelIndex', this.levelIndex + 1);
  }

  restart() {
    this.state.set('levelIndex', 0);
    this.state.set('score', 0);
    this.state.set('lives', 3);
  }
}
