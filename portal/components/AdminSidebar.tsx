'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

const RED = '#de1c22'

const NAV = [
  {
    href: '/admin',
    exact: true,
    label: 'Dashboard',
    icon: (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <rect x={1} y={1} width={6} height={6} rx={1.5} fill="currentColor" />
        <rect x={9} y={1} width={6} height={6} rx={1.5} fill="currentColor" />
        <rect x={1} y={9} width={6} height={6} rx={1.5} fill="currentColor" />
        <rect x={9} y={9} width={6} height={6} rx={1.5} fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/admin/triagem',
    exact: false,
    label: 'Triagem',
    icon: (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <path d="M8 1.5L9.5 5h3.5l-2.8 2.1 1.1 3.4L8 8.5l-3.3 2 1.1-3.4L3 5h3.5L8 1.5z" fill="currentColor" />
      </svg>
    ),
    badge: true,
  },
  {
    href: '/admin/pedidos',
    exact: false,
    label: 'Pedidos',
    icon: (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <rect x={2} y={3} width={12} height={1.5} rx={0.75} fill="currentColor" />
        <rect x={2} y={7.25} width={12} height={1.5} rx={0.75} fill="currentColor" />
        <rect x={2} y={11.5} width={8} height={1.5} rx={0.75} fill="currentColor" />
      </svg>
    ),
  },
  {
    href: '/admin/equipamentos',
    exact: false,
    label: 'Equipamentos',
    icon: (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <path d="M2 11V7l3-4h6l3 4v4H2z" stroke="currentColor" strokeWidth={1.5} fill="none" />
        <circle cx={5} cy={12.5} r={1.5} fill="currentColor" />
        <circle cx={11} cy={12.5} r={1.5} fill="currentColor" />
        <path d="M5 7h6" stroke="currentColor" strokeWidth={1.2} />
      </svg>
    ),
  },
  {
    href: '/admin/inadimplencia',
    exact: false,
    label: 'Inadimplência',
    icon: (
      <svg width={16} height={16} viewBox="0 0 16 16" fill="none">
        <path d="M8 2L1.5 13.5h13L8 2z" stroke="currentColor" strokeWidth={1.5} fill="none" strokeLinejoin="round" />
        <path d="M8 6.5v3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
        <circle cx={8} cy={11.5} r={0.75} fill="currentColor" />
      </svg>
    ),
  },
]

export default function AdminSidebar({ triageCount }: { triageCount?: number }) {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(true)

  const W = isExpanded ? 220 : 80

  return (
    <aside style={{
      width: W,
      minHeight: '100vh',
      background: '#0a111e',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      flexShrink: 0,
      transition: 'width 220ms ease-out',
      overflow: 'hidden',
    }}>

      {/* Toggle */}
      <div style={{
        padding: '12px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        justifyContent: isExpanded ? 'flex-start' : 'center',
      }}>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Colapsar menu' : 'Expandir menu'}
          aria-label={isExpanded ? 'Colapsar menu' : 'Expandir menu'}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            width: 44,
            height: 44,
            borderRadius: 6,
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
          <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {NAV.map((item) => {
          const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0 12px',
                minHeight: 44,
                borderRadius: 8,
                textDecoration: 'none',
                marginBottom: 2,
                background: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#f1f5f9' : '#94a3b8',
                fontSize: 14,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 100ms',
                position: 'relative',
                justifyContent: isExpanded ? 'flex-start' : 'center',
              }}
              title={!isExpanded ? item.label : undefined}
            >
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {isExpanded && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && triageCount !== undefined && triageCount > 0 && (
                    <span style={{
                      background: '#1d4ed8',
                      color: '#93c5fd',
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: 9999,
                      lineHeight: 1.6,
                    }}>
                      {triageCount}
                    </span>
                  )}
                </>
              )}
              {isActive && (
                <span style={{
                  position: 'absolute',
                  left: 0,
                  top: 6,
                  bottom: 6,
                  width: 3,
                  borderRadius: 2,
                  background: RED,
                }} />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div style={{ borderTop: '1px solid #1e293b' }}>
        {isExpanded && (
          <div style={{ padding: '8px 8px 12px' }}>
            <Link href="/" style={{ fontSize: 12, color: '#94a3b8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', minHeight: 44, borderRadius: 6 }}>
              <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Portal do Cliente
            </Link>
          </div>
        )}
      </div>

    </aside>
  )
}
