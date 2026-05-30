type SimpleLineChartProps = {
  values: number[];
};

function SimpleLineChart({ values }: SimpleLineChartProps) {
  const width = 640;
  const height = 180;
  const padding = 24;
  const plotWidth = width - padding * 2;
  const plotHeight = height - padding * 2;

  if (values.length === 0) {
    return null;
  }

  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : padding + (index / (values.length - 1)) * plotWidth;
    const y = padding + (1 - value / 100) * plotHeight;
    return { x, y, value };
  });
  const path = points.map((point) => `${point.x},${point.y}`).join(" ");

  return (
    <svg className="line-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="最新100件のスコア推移">
      <line className="chart-grid" x1={padding} x2={width - padding} y1={padding} y2={padding} />
      <line className="chart-grid" x1={padding} x2={width - padding} y1={height / 2} y2={height / 2} />
      <line className="chart-grid" x1={padding} x2={width - padding} y1={height - padding} y2={height - padding} />
      <text className="chart-label" x={padding} y={padding - 8}>
        100
      </text>
      <text className="chart-label" x={padding} y={height / 2 - 8}>
        50
      </text>
      <text className="chart-label" x={padding} y={height - padding - 8}>
        0
      </text>
      {points.length > 1 ? <polyline className="chart-line" points={path} /> : null}
      {points.map((point, index) => (
        <circle className="chart-point" cx={point.x} cy={point.y} key={`${point.x}-${index}`} r={points.length === 1 ? 5 : 3.5}>
          <title>{`${index + 1}件目: ${point.value}点`}</title>
        </circle>
      ))}
    </svg>
  );
}

export default SimpleLineChart;
