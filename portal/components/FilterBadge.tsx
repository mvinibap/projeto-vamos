'use client'

export function FilterBadge({
  label,
  value,
  color,
  bg,
  active,
  onClick,
}: {
  label: string
  value: number
  color: string
  bg: string
  active: boolean
  onClick: () => void
}) {
  const activeBg = bg.replace(/0\.\d+\)$/, (m) =>
    `${Math.min(1, parseFloat(m) * 1.8).toFixed(2)})`
  )
  return (
    <button
      onClick={onClick}
      style={{
        background: active ? activeBg : bg,
        border: `1px solid ${active ? color : `${color}25`}`,
        borderRadius: 8,
        padding: '8px 16px',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        cursor: 'pointer',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        boxShadow: active ? `0 0 0 1px ${color}40` : 'none',
      }}
    >
      <span style={{ fontSize: 20, fontWeight: 800, color, fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)', lineHeight: 1 }}>
        {value}
      </span>
      <span style={{ fontSize: 12, color: active ? '#cbd5e1' : '#64748b' }}>{label}</span>
      {active && <span style={{ fontSize: 10, color, marginLeft: 2 }}>✕</span>}
    </button>
  )
}
