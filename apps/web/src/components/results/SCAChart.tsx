import { RATIO_LINES, SCA, extractionOf, strengthOf } from '../../model/sca'
import { useT } from '../../i18n/LanguageContext'

const ABS = 2.0
const W = 360
const H = 300
const M = { top: 16, right: 16, bottom: 36, left: 44 }
const PW = W - M.left - M.right
const PH = H - M.top - M.bottom

const x = (ey: number) => M.left + ((ey - SCA.ey.min) / (SCA.ey.max - SCA.ey.min)) * PW
const y = (tds: number) => M.top + (1 - (tds - SCA.tds.min) / (SCA.tds.max - SCA.tds.min)) * PH

export function SCAChart({ ey, tds, source }: { ey: number; tds: number; source: 'predicted' | 'measured' }) {
  const { t } = useT()
  const px = clampX(x(ey))
  const py = clampY(y(tds))

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full text-coffee-300" role="img" aria-label="SCA Brewing Control Chart">
        {/* ideal gold-cup box */}
        <rect
          x={x(SCA.idealEy.min)}
          y={y(SCA.idealTds.max)}
          width={x(SCA.idealEy.max) - x(SCA.idealEy.min)}
          height={y(SCA.idealTds.min) - y(SCA.idealTds.max)}
          fill="rgba(6,148,148,0.14)"
          stroke="#069494"
          strokeDasharray="4 3"
        />

        {/* ratio diagonals: tds = ey/(ratio-ABS) */}
        {RATIO_LINES.map((r) => {
          const t1 = SCA.ey.min / (r.value - ABS)
          const t2 = SCA.ey.max / (r.value - ABS)
          return (
            <g key={r.value}>
              <line x1={x(SCA.ey.min)} y1={clampY(y(t1))} x2={x(SCA.ey.max)} y2={clampY(y(t2))} stroke="#534f4d" strokeWidth={1} strokeDasharray="2 4" />
              <text x={x(SCA.ey.max) - 2} y={clampY(y(t2)) - 3} fontSize={9} fill="currentColor" textAnchor="end">
                {r.label}
              </text>
            </g>
          )
        })}

        {/* axes */}
        <line x1={M.left} y1={M.top} x2={M.left} y2={M.top + PH} stroke="#3d3a39" />
        <line x1={M.left} y1={M.top + PH} x2={M.left + PW} y2={M.top + PH} stroke="#3d3a39" />

        {/* x ticks (EY) */}
        {[14, 16, 18, 20, 22, 24, 26].map((v) => (
          <g key={v}>
            <line x1={x(v)} y1={M.top + PH} x2={x(v)} y2={M.top + PH + 4} stroke="#3d3a39" />
            <text x={x(v)} y={M.top + PH + 15} fontSize={9} fill="currentColor" textAnchor="middle">
              {v}
            </text>
          </g>
        ))}
        {/* y ticks (TDS) */}
        {[0.9, 1.0, 1.15, 1.25, 1.35, 1.5].map((v) => (
          <g key={v}>
            <line x1={M.left - 4} y1={y(v)} x2={M.left} y2={y(v)} stroke="#3d3a39" />
            <text x={M.left - 6} y={y(v) + 3} fontSize={9} fill="currentColor" textAnchor="end">
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* axis labels */}
        <text x={M.left + PW / 2} y={H - 2} fontSize={10} fill="currentColor" textAnchor="middle">
          {t('ey')} (%)
        </text>
        <text x={12} y={M.top + PH / 2} fontSize={10} fill="currentColor" textAnchor="middle" transform={`rotate(-90 12 ${M.top + PH / 2})`}>
          {t('tds')} (%)
        </text>

        {/* plotted point */}
        <circle cx={px} cy={py} r={7} fill={source === 'measured' ? '#069494' : '#E84B3D'} stroke="#171717" strokeWidth={2} />
        <circle cx={px} cy={py} r={13} fill="none" stroke={source === 'measured' ? '#069494' : '#E84B3D'} strokeOpacity={0.4} />
      </svg>
      <div className="mt-1 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-coffee-300">
        <span>
          <b className="text-crema">{t(`${strengthLabel(tds)}` as never)}</b> · {t('tds')} {tds.toFixed(2)}%
        </span>
        <span>
          <b className="text-crema">{t(`${extractionLabel(ey)}` as never)}</b> · {t('ey')} {ey.toFixed(1)}%
        </span>
      </div>
    </div>
  )
}

const clampX = (v: number) => Math.min(M.left + PW, Math.max(M.left, v))
const clampY = (v: number) => Math.min(M.top + PH, Math.max(M.top, v))

function strengthLabel(tds: number) {
  const s = strengthOf(tds)
  return s === 'weak' ? 'weak' : s === 'strong' ? 'strong' : 'ideal'
}
function extractionLabel(ey: number) {
  const e = extractionOf(ey)
  return e === 'under' ? 'underExtracted' : e === 'over' ? 'overExtracted' : 'ideal'
}
