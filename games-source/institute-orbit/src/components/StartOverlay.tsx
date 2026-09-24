
interface StartOverlayProps {
  fetchState: 'idle' | 'loading' | 'done' | 'error';
  errorMsg: string;
  onStart: () => void;
}

export default function StartOverlay({ fetchState, errorMsg, onStart }: StartOverlayProps) {
  let statusText = '';
  let btnText = 'Start Game';
  let btnDisabled = false;

  if (fetchState === 'loading') {
    statusText = 'Loading quiz...';
    btnText = 'Loading...';
    btnDisabled = true;
  } else if (fetchState === 'error') {
    statusText = 'Error loading quiz.';
    btnText = 'Retry';
  }

  return (
    <div id="start-overlay">
      <div className="start-box">
        <h2>Welcome to Institute Orbit</h2>
        <img src="./assets/logo.png" alt="Logo" id="logo" style={{ width: '150px', marginBottom: '20px' }} />
        <p id="start-status">{statusText}</p>
        <p id="quiz-error" style={{ color: 'red' }}>{errorMsg}</p>
        <button id="start-btn" onClick={onStart} disabled={btnDisabled}>
          {btnText}
        </button>
      </div>
    </div>
  );
}
