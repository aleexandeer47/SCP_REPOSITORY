import { useId, useState } from 'react'
import './BudgetsChart.css'

const CHART_WIDTH = 520
const CHART_HEIGHT = 200
const PADDING_LEFT = 42
const PADDING_RIGHT = 12
const PADDING_TOP = 16
const PADDING_BOTTOM = 28
const BAR_MAX_WIDTH = 24

function niceMax(max) {
  if (!max || max <= 0) return 100
  const step = max <= 2000 ? 500 : 1000
  return Math.ceil(max / step) * step
}

export default function BudgetsChart({ title = 'Costos del mes', data, dateRangeLabel }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const gradientId = useId()

  if (data.length === 0) {
    return (
      <div className="budgets-chart">
        <div className="budgets-chart-header">
          <h3 className="budgets-chart-title">{title}</h3>
        </div>
        <p className="budgets-chart-empty">Todavía no hay costos registrados este mes.</p>
      </div>
    )
  }

  const plotWidth = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM
  const maxValue = niceMax(Math.max(...data.map((d) => d.value)))
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round((maxValue * f) / 100) * 100)

  const slot = plotWidth / data.length
  const barWidth = Math.min(BAR_MAX_WIDTH, slot * 0.5)

  const points = data.map((d, i) => {
    const x = PADDING_LEFT + slot * i + slot / 2
    const y = PADDING_TOP + plotHeight - (d.value / maxValue) * plotHeight
    return { ...d, x, y }
  })

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="budgets-chart">
      <div className="budgets-chart-header">
        <h3 className="budgets-chart-title">{title}</h3>
        <div className="budgets-chart-filter">
          <span>Fecha:</span>
          <button type="button" className="budgets-chart-range">
            {dateRangeLabel}
          </button>
        </div>
      </div>

      <div className="budgets-chart-plot">
        <svg viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`} role="img" aria-label="Presupuestos y costos por semana">
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--brand-400)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="var(--brand-400)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => {
            const y = PADDING_TOP + plotHeight - (tick / maxValue) * plotHeight
            return (
              <g key={tick}>
                <line
                  x1={PADDING_LEFT}
                  x2={CHART_WIDTH - PADDING_RIGHT}
                  y1={y}
                  y2={y}
                  className="budgets-chart-gridline"
                />
                <text x={PADDING_LEFT - 8} y={y + 3} className="budgets-chart-axis-label" textAnchor="end">
                  {tick.toLocaleString('es-MX')}
                </text>
              </g>
            )
          })}

          <path d={`${linePath} L ${points.at(-1).x} ${PADDING_TOP + plotHeight} L ${points[0].x} ${PADDING_TOP + plotHeight} Z`} fill={`url(#${gradientId})`} stroke="none" />

          {points.map((p) => (
            <rect
              key={`bar-${p.label}`}
              x={p.x - barWidth / 2}
              y={p.y}
              width={barWidth}
              height={PADDING_TOP + plotHeight - p.y}
              rx={4}
              className={`budgets-chart-bar ${activeIndex === p.label ? 'budgets-chart-bar--active' : ''}`}
              onMouseEnter={() => setActiveIndex(p.label)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}

          <path d={linePath} className="budgets-chart-trend" fill="none" />

          {points.map((p) => (
            <circle
              key={`dot-${p.label}`}
              cx={p.x}
              cy={p.y}
              r={4}
              className="budgets-chart-dot"
              onMouseEnter={() => setActiveIndex(p.label)}
              onMouseLeave={() => setActiveIndex(null)}
            />
          ))}

          <line
            x1={PADDING_LEFT}
            x2={CHART_WIDTH - PADDING_RIGHT}
            y1={PADDING_TOP + plotHeight}
            y2={PADDING_TOP + plotHeight}
            className="budgets-chart-baseline"
          />

          {points.map((p) => (
            <text key={`label-${p.label}`} x={p.x} y={CHART_HEIGHT - 6} className="budgets-chart-axis-label" textAnchor="middle">
              {p.label}
            </text>
          ))}
        </svg>

        {activeIndex !== null && (
          <div
            className="budgets-chart-tooltip"
            style={{
              left: `${(points.find((p) => p.label === activeIndex).x / CHART_WIDTH) * 100}%`,
              top: `${(points.find((p) => p.label === activeIndex).y / CHART_HEIGHT) * 100}%`,
            }}
          >
            <p className="budgets-chart-tooltip-label">{activeIndex}</p>
            <p className="budgets-chart-tooltip-value">
              ${points.find((p) => p.label === activeIndex).value.toLocaleString('es-MX')}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
