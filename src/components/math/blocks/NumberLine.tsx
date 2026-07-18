import type { NumberLineDiagram } from "../../../../content/subjects/math/types";

function formatTick(value: number) {
  if (value === 0) return "0";
  return value > 0 ? `＋${value}` : `−${Math.abs(value)}`;
}

export function NumberLine({ diagram }: { diagram: NumberLineDiagram }) {
  const width = 640;
  const height = 96;
  const left = 20;
  const right = 620;
  const y = 60;

  const toX = (value: number) => left + ((value - diagram.min) / (diagram.max - diagram.min)) * (right - left);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", maxWidth: 600, display: "block", margin: "0 auto" }}>
      <line x1={left} y1={y} x2={right} y2={y} stroke="#8a7a5c" strokeWidth={2} />
      <polygon points={`${right},${y} ${right - 10},${y - 5} ${right - 10},${y + 5}`} fill="#8a7a5c" />
      <g fontFamily="var(--font-jp)" fontSize={13} fill="#6d5f47" textAnchor="middle">
        {diagram.ticks.map((tick) => (
          <g key={tick}>
            <line x1={toX(tick)} y1={y - 5} x2={toX(tick)} y2={y + 5} stroke="#8a7a5c" strokeWidth={2} />
            <text x={toX(tick)} y={y + 24}>
              {formatTick(tick)}
            </text>
          </g>
        ))}
        <text x={left + 20} y={30} fontWeight={700}>
          西
        </text>
        <text x={right - 20} y={30} fontWeight={700}>
          東
        </text>
      </g>
      {diagram.arrow ? (
        <g>
          <path
            d={`M ${toX(diagram.arrow.from)} 44 Q ${(toX(diagram.arrow.from) + toX(diagram.arrow.to)) / 2} 20 ${toX(diagram.arrow.to) - 2} 42`}
            fill="none"
            stroke="var(--m-accent)"
            strokeWidth={2.5}
          />
          <polygon
            points={`${toX(diagram.arrow.to)},44 ${toX(diagram.arrow.to) - 10},38 ${toX(diagram.arrow.to) - 6},48`}
            fill="var(--m-accent)"
          />
          <text x={(toX(diagram.arrow.from) + toX(diagram.arrow.to)) / 2} y={18} fontSize={13} fontWeight={700} fill="var(--m-dark)" textAnchor="middle" fontFamily="var(--font-jp)">
            {diagram.arrow.label}
          </text>
        </g>
      ) : null}
    </svg>
  );
}
