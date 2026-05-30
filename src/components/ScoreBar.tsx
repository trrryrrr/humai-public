type ScoreBarProps = {
  value: number;
  label?: string;
  tone?: "default" | "quiet";
};

function ScoreBar({ value, label, tone = "default" }: ScoreBarProps) {
  const boundedValue = Math.max(0, Math.min(100, value));

  return (
    <div className={tone === "quiet" ? "score-bar score-bar-quiet" : "score-bar"}>
      {label && (
        <div className="score-bar-header">
          <span>{label}</span>
          <strong>{formatValue(value)}</strong>
        </div>
      )}
      <div className="score-bar-track" aria-hidden="true">
        <span style={{ width: `${boundedValue}%` }} />
      </div>
    </div>
  );
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

export default ScoreBar;
