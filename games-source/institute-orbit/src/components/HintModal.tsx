
interface HintModalProps {
  hintText: string;
  onClose: () => void;
}

export default function HintModal({ hintText, onClose }: HintModalProps) {
  return (
    <div id="hint-modal">
      <div className="hint-box">
        <h3>💡 Hint</h3>
        <p id="hint-text">{hintText}</p>
        <button id="close-hint" onClick={onClose}>Got it!</button>
      </div>
    </div>
  );
}
