'use client'

import { useEffect, useRef, useState } from 'react'

const STATS = [
  { from: 0,  target: 20, suffix: '+', label: 'Categorias de equipamento' },
  { from: 0,  target: 27, suffix: '',  label: 'Estados cobertos' },
  { from: 0,  target: 15, suffix: 'k', label: 'Ativos disponíveis' },
  { from: 96, target: 48, suffix: 'h', label: 'Para receber proposta' },
]

function useCountTo(from: number, target: number, duration: number, active: boolean) {
  const [value, setValue] = useState(from)
  useEffect(() => {
    if (!active) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(from + (target - from) * eased))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [active, from, target, duration])
  return value
}

function StatItem({ from, target, suffix, label, active }: typeof STATS[0] & { active: boolean }) {
  const count = useCountTo(from, target, 700, active)
  return (
    <div>
      <div className="font-display" style={{ fontSize: 38, fontWeight: 800, color: 'var(--text)', letterSpacing: '-1.5px', lineHeight: 1 }}>
        {count}<span style={{ color: 'var(--red)' }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4, fontWeight: 500 }}>{label}</div>
    </div>
  )
}

export default function HeroStats() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect() } },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="hero-stats" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, padding: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
      {STATS.map((s) => (
        <StatItem key={s.label} {...s} active={active} />
      ))}
      <div style={{ gridColumn: '1 / -1', borderTop: '1px solid var(--border)', paddingTop: 16, fontSize: 14, color: 'var(--muted)', display: 'flex', gap: 6 }}>
        <span style={{ color: 'var(--red)', fontWeight: 700 }}>✓</span>
        Proposta confirmada por especialista VAMOS — sem pagamento online
      </div>
    </div>
  )
}
