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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const sidebarWidth = isMobile && !isExpanded ? 64 : 220

  return (
    <aside style={{
      width: sidebarWidth,
      minHeight: '100vh',
      background: '#0a111e',
      borderRight: '1px solid #1e293b',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      height: '100vh',
      flexShrink: 0,
      transition: 'width 200ms ease-out',
    }}>
      {/* Brand / Toggle */}
      <div style={{
        padding: '20px 16px 16px',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isMobile ? 'space-between' : 'flex-start',
        gap: 10,
      }}>
        {isExpanded && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: RED, color: '#fff', fontWeight: 800, fontSize: 13,
              padding: '4px 7px', borderRadius: 4, lineHeight: 1, letterSpacing: '-0.3px',
              fontFamily: 'var(--font-display, Cabinet Grotesk, sans-serif)',
            }}>
              VAMOS
            </span>
            <span style={{ fontSize: 11, color: '#334155', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Painel Admin
            </span>
          </div>
        )}
        {isMobile && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748b',
              cursor: 'pointer',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              transition: 'color 100ms',
              marginLeft: 'auto',
            }}
            title={isExpanded ? 'Colapsar' : 'Expandir'}
          >
            {isExpanded ? '✕' : '☰'}
          </button>
        )}
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
                padding: '9px 10px',
                borderRadius: 8,
                textDecoration: 'none',
                marginBottom: 2,
                background: isActive ? '#1e293b' : 'transparent',
                color: isActive ? '#f1f5f9' : '#64748b',
                fontSize: 13,
                fontWeight: isActive ? 600 : 400,
                transition: 'all 100ms',
                position: 'relative',
                justifyContent: !isExpanded ? 'center' : 'flex-start',
              }}
              title={!isExpanded ? item.label : undefined}
            >
              <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {isExpanded && (
                <>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && triageCount !== undefined && triageCount > 0 && (
                    <span style={{
                      background: RED,
                      color: '#fff',
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
      {isExpanded && (
        <div style={{ padding: '16px', borderTop: '1px solid #1e293b' }}>
          <Link href="/" style={{ fontSize: 12, color: '#475569', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
              <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Portal do Cliente
          </Link>
        </div>
      )}
    </aside>
  )
}
