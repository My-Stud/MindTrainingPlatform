
interface PauseOverlayProps {
  onResume: () => void;
}

export default function PauseOverlay({ onResume }: PauseOverlayProps) {
  return (
    <div id="pause-overlay" onClick={onResume}>
      <div>Paused</div>
      <p>Press anywhere to resume</p>
      <div className="resume-hint">Resume</div>
    </div>
  );
}
