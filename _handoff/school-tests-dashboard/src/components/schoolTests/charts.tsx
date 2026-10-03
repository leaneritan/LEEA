"use client";

// Small hand-drawn SVG charts. No chart library: every chart here is a few
// dozen lines, scales with its container (viewBox), and prints cleanly.

import { useState, type ReactNode } from "react";

const AXIS = "var(--stx-axis)";
const GRID = "var(--stx-grid)";
const MUTED = "var(--stx-muted)";

function niceStep(range: number, target = 5) {
  const raw = range / target;
  const pow = 10 ** Math.floor(Math.log10(raw || 1));
  const n = raw / pow;
  return (n >= 5 ? 10 : n >= 2 ? 5 : n >= 1 ? 2 : 1) * pow;
}

function ticks(min: number, max: number, target = 5) {
  const step = niceStep(max - min, target);
  const out: number[] = [];
  for (let v = Math.ceil(min / step) * step; v <= max + 1e-9; v += step) out.push(Math.round(v * 100) / 100);
  return out;
}

// ---------- Line chart ----------

export type LineSeries = {
  id: string;
  label: string;
  color: string;
  values: Array<number | null>;
  dashed?: boolean;
  /** Draw value labels next to points. */
  labels?: boolean;
  width?: number;
};

export function LineChart({
  categories,
  series,
  invert = false,
  yMin,
  yMax,
  height = 260,
  refLines = [],
  format = (v: number) => String(v),
  bandColors,
  width = 720
}: {
  categories: string[];
  series: LineSeries[];
  /** For ranks: smaller is better, so it goes on top. */
  invert?: boolean;
  yMin?: number;
  yMax?: number;
  height?: number;
  refLines?: Array<{ value: number; label: string; color: string }>;
  format?: (v: number) => string;
  /** Optional colour per category, drawn as a thin band under the axis label. */
  bandColors?: string[];
  /** viewBox width — smaller for small charts so the text stays readable. */
  width?: number;
}) {
  const W = width;
  const H = height;
  const pad = { l: 46, r: 24, t: 18, b: 46 };
  const all = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
  refLines.forEach((r) => all.push(r.value));
  if (!all.length) return <div className="stx-empty">データがありません</div>;
  let lo = yMin ?? Math.min(...all);
  let hi = yMax ?? Math.max(...all);
  if (lo === hi) {
    lo -= 5;
    hi += 5;
  }
  const span = hi - lo;
  if (yMin === undefined) lo -= span * 0.12;
  if (yMax === undefined) hi += span * 0.12;
  const ts = ticks(lo, hi);
  const x = (i: number) => (categories.length <= 1 ? (pad.l + W - pad.r) / 2 : pad.l + 20 + (i * (W - pad.l - pad.r - 40)) / (categories.length - 1));
  const y = (v: number) => {
    const f = (v - lo) / (hi - lo);
    return invert ? pad.t + f * (H - pad.t - pad.b) : H - pad.b - f * (H - pad.t - pad.b);
  };
  return (
    <svg className="stx-chart" viewBox={`0 0 ${W} ${H}`} role="img">
      {ts.map((t) => (
        <g key={t}>
          <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} stroke={GRID} />
          <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" fontSize="11" fill={MUTED}>
            {format(t)}
          </text>
        </g>
      ))}
      {lo < 0 && hi > 0 && <line x1={pad.l} x2={W - pad.r} y1={y(0)} y2={y(0)} stroke={AXIS} strokeWidth={1.4} />}
      {refLines.map((r) => (
        <g key={r.label}>
          <line x1={pad.l} x2={W - pad.r} y1={y(r.value)} y2={y(r.value)} stroke={r.color} strokeDasharray="6 5" strokeWidth={1.6} />
          <text x={W - pad.r} y={y(r.value) - 5} textAnchor="end" fontSize="11" fontWeight={700} fill={r.color}>
            {r.label}
          </text>
        </g>
      ))}
      {categories.map((c, i) => (
        <g key={c + i}>
          {bandColors?.[i] && <rect x={x(i) - 22} y={H - pad.b + 8} width={44} height={3} rx={1.5} fill={bandColors[i]} />}
          <text x={x(i)} y={H - pad.b + 26} textAnchor="middle" fontSize="11.5" fill="var(--stx-text)">
            {c}
          </text>
        </g>
      ))}
      {series.map((s) => {
        const pts = s.values.map((v, i) => (v === null ? null : ([x(i), y(v)] as const)));
        const segs: string[] = [];
        let cur = "";
        pts.forEach((p) => {
          if (!p) {
            if (cur) segs.push(cur);
            cur = "";
          } else cur += `${cur ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`;
        });
        if (cur) segs.push(cur);
        return (
          <g key={s.id}>
            {segs.map((d, i) => (
              <path key={i} d={d} fill="none" stroke={s.color} strokeWidth={s.width ?? 2.6} strokeDasharray={s.dashed ? "6 5" : undefined} strokeLinejoin="round" />
            ))}
            {pts.map((p, i) =>
              p ? (
                <g key={i}>
                  <circle cx={p[0]} cy={p[1]} r={s.dashed ? 3 : 4.5} fill="var(--stx-card)" stroke={s.color} strokeWidth={2.2} />
                  {s.labels && (
                    <text x={p[0]} y={p[1] - 10} textAnchor="middle" fontSize="11.5" fontWeight={700} fill={s.color}>
                      {format(s.values[i] as number)}
                    </text>
                  )}
                </g>
              ) : null
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ---------- Diverging bars (平均との差) ----------

export function DivergingBars({
  rows,
  format = (v: number) => (v > 0 ? `+${v}` : String(v)),
  unit = "点"
}: {
  rows: Array<{ id: string; label: string; value: number; color: string; note?: string }>;
  format?: (v: number) => string;
  unit?: string;
}) {
  const max = Math.max(5, ...rows.map((r) => Math.abs(r.value)));
  return (
    <div className="stx-div">
      {rows.map((r) => {
        const w = (Math.abs(r.value) / max) * 50;
        return (
          <div className="stx-div-row" key={r.id}>
            <span className="stx-div-label" style={{ color: r.color }}>
              {r.label}
            </span>
            <div className="stx-div-track">
              <span className="stx-div-mid" />
              <span
                className="stx-div-bar"
                style={{
                  background: r.value >= 0 ? r.color : "var(--stx-bad)",
                  left: r.value >= 0 ? "50%" : `${50 - w}%`,
                  width: `${w}%`,
                  opacity: r.value >= 0 ? 0.9 : 0.75
                }}
              />
            </div>
            <span className={r.value >= 0 ? "stx-good stx-num" : "stx-bad stx-num"}>
              {format(r.value)}
              {unit}
            </span>
            {r.note && <span className="stx-div-note">{r.note}</span>}
          </div>
        );
      })}
    </div>
  );
}

// ---------- Radar ----------

export function Radar({
  axes,
  series,
  max = 100,
  size = 300
}: {
  axes: Array<{ id: string; label: string; color?: string }>;
  series: Array<{ id: string; label: string; color: string; values: number[]; dashed?: boolean; fill?: boolean }>;
  max?: number;
  size?: number;
}) {
  const c = size / 2;
  const r = c - 42;
  const ang = (i: number) => -Math.PI / 2 + (i * 2 * Math.PI) / axes.length;
  const pt = (i: number, v: number) => [c + Math.cos(ang(i)) * (r * Math.max(0, Math.min(v, max))) / max, c + Math.sin(ang(i)) * (r * Math.max(0, Math.min(v, max))) / max];
  return (
    <svg className="stx-chart stx-radar" viewBox={`0 0 ${size} ${size}`} role="img">
      {[0.2, 0.4, 0.6, 0.8, 1].map((f) => (
        <polygon key={f} points={axes.map((_, i) => pt(i, max * f).join(",")).join(" ")} fill="none" stroke={GRID} />
      ))}
      {axes.map((a, i) => {
        const [x, y] = pt(i, max * 1.17);
        const [lx, ly] = pt(i, max);
        return (
          <g key={a.id}>
            <line x1={c} y1={c} x2={lx} y2={ly} stroke={GRID} />
            <text x={x} y={y + 4} textAnchor="middle" fontSize="13" fontWeight={700} fill={a.color ?? "var(--stx-text)"}>
              {a.label}
            </text>
          </g>
        );
      })}
      {series.map((s) => (
        <polygon
          key={s.id}
          points={s.values.map((v, i) => pt(i, v).join(",")).join(" ")}
          fill={s.fill ? s.color : "none"}
          fillOpacity={s.fill ? 0.16 : 0}
          stroke={s.color}
          strokeWidth={2.4}
          strokeDasharray={s.dashed ? "5 4" : undefined}
        />
      ))}
    </svg>
  );
}

// ---------- Domain bars: Leo's rate vs everyone's ----------

export function RateBars({
  rows,
  color
}: {
  rows: Array<{ id: string; label: string; sub?: string; rate: number; overall: number }>;
  color: string;
}) {
  return (
    <div className="stx-rates">
      {rows.map((r) => {
        const gap = r.rate - r.overall;
        return (
          <div className="stx-rate-row" key={r.id}>
            <div className="stx-rate-label">
              {r.label}
              {r.sub && <small>{r.sub}</small>}
            </div>
            <div className="stx-rate-track" title={`Leo ${r.rate}% / 全体 ${r.overall}%`}>
              <span className="stx-rate-bar" style={{ width: `${r.rate}%`, background: color }} />
              <span className="stx-rate-mark" style={{ left: `${r.overall}%` }} />
            </div>
            <span className={`stx-num ${gap >= 0 ? "stx-good" : "stx-bad"}`}>{gap > 0 ? `+${gap}` : gap}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Difficulty strip: each question placed by 全体正答率 ----------

export function DifficultyStrip({
  items,
  onPick
}: {
  items: Array<{ id: string; rate: number; ok: boolean; label: string; value: number }>;
  onPick?: (id: string) => void;
}) {
  const W = 1000;
  const H = 70;
  const pad = 12;
  const base = H - 20;
  const x = (r: number) => pad + (r / 100) * (W - pad * 2);
  // Stack dots that share a spot so none hide.
  const used = new Map<number, number>();
  return (
    <svg className="stx-chart" viewBox={`0 0 ${W} ${H}`} role="img">
      <rect x={x(60)} y={2} width={x(100) - x(60)} height={base - 2} fill="var(--stx-bad-soft)" opacity={0.6} rx={6} />
      <line x1={pad} x2={W - pad} y1={base} y2={base} stroke={AXIS} />
      {[0, 20, 40, 60, 80, 100].map((t) => (
        <text key={t} x={x(t)} y={H - 5} textAnchor="middle" fontSize="11" fill={MUTED}>
          {t}%
        </text>
      ))}
      {items.map((it) => {
        const bucket = Math.round(it.rate / 1.5);
        const n = used.get(bucket) ?? 0;
        used.set(bucket, n + 1);
        const cy = base - 7 - (n % 5) * 10;
        return (
          <circle
            key={it.id}
            cx={x(it.rate) + Math.floor(n / 5) * 5}
            cy={cy}
            r={it.ok ? 4 : 5}
            fill={it.ok ? "var(--stx-good-soft)" : "var(--stx-bad)"}
            stroke={it.ok ? "var(--stx-good)" : "var(--stx-card)"}
            strokeWidth={1.3}
            style={{ cursor: onPick ? "pointer" : undefined }}
            onClick={() => onPick?.(it.id)}
          >
            <title>{`${it.label}（全体${it.rate}%・${it.value}点）${it.ok ? "○" : "×"}`}</title>
          </circle>
        );
      })}
    </svg>
  );
}

// ---------- Stacked bar ----------

export function StackBar({ parts, total }: { parts: Array<{ id: string; label: string; value: number; color: string }>; total?: number }) {
  const sum = total ?? parts.reduce((a, p) => a + p.value, 0);
  return (
    <div className="stx-stack">
      <div className="stx-stack-bar">
        {parts.map((p) =>
          p.value > 0 ? <span key={p.id} title={`${p.label} ${p.value}`} style={{ width: `${(p.value / (sum || 1)) * 100}%`, background: p.color }} /> : null
        )}
      </div>
      <div className="stx-stack-legend">
        {parts.map((p) => (
          <span key={p.id}>
            <i style={{ background: p.color }} />
            {p.label} <b>{p.value}</b>
          </span>
        ))}
      </div>
    </div>
  );
}

// ---------- Ring ----------

export function Ring({ value, max, color, size = 120, children }: { value: number; max: number; color: string; size?: number; children?: ReactNode }) {
  const r = size / 2 - 9;
  const c = 2 * Math.PI * r;
  const f = max ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className="stx-ring" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--stx-grid)" strokeWidth={10} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${c * f} ${c}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="stx-ring-in">{children}</div>
    </div>
  );
}

// ---------- Toggle chips ----------

export function Chips<T extends string>({
  options,
  value,
  onChange
}: {
  options: Array<{ id: T; label: string; color?: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="stx-chips" role="tablist">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className={value === o.id ? "on" : ""}
          style={value === o.id && o.color ? { background: o.color, borderColor: o.color } : undefined}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function MultiChips<T extends string>({
  options,
  value,
  onChange
}: {
  options: Array<{ id: T; label: string; color?: string }>;
  value: T[];
  onChange: (v: T[]) => void;
}) {
  return (
    <div className="stx-chips">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            className={on ? "on" : ""}
            style={on && o.color ? { background: o.color, borderColor: o.color } : undefined}
            onClick={() => onChange(on ? value.filter((v) => v !== o.id) : [...value, o.id])}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function useToggle(initial = false) {
  const [v, set] = useState(initial);
  return [v, () => set((x) => !x)] as const;
}
