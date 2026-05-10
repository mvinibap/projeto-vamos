'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const RED = '#de1c22'
const MOBILE_BREAKPOINT = '(max-width: 767px)'

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
  // Desktop: collapsed = 80px rail, expanded = 220px. Mobile: closed = off-canvas, open = 280px drawer.
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_BREAKPOINT)
    const update = (matches: boolean) => {
      setIsMobile(matches)
      setIsOpen(!matches)
    }
    update(mq.matches)
    const handler = (e: MediaQueryListEvent) => update(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // ESC closes mobile drawer
  useEffect(() => {
    if (!isMobile || !isOpen) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMobile, isOpen])

  // Lock body scroll while drawer is open on mobile
  useEffect(() => {
    if (!isMobile) return
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobile, isOpen])

  const W = isMobile ? 280 : (isOpen ? 220 : 80)
  const showLabels = isMobile ? true : isOpen

  return (
    <>
      {/* Mobile hamburger trigger — fixed top-left, only when drawer is closed */}
      {isMobile && !isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          style={{
            position: 'fixed',
            top: 14,
            left: 12,
            zIndex: 60,
            width: 44,
            height: 44,
            background: '#0a111e',
            border: '1px solid var(--admin-surf2)',
            borderRadius: 8,
            color: '#cbd5e1',
            cursor: 'pointer',
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
      )}

      {/* Backdrop on mobile only */}
      {isMobile && isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          aria-hidden
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(3, 7, 18, 0.6)',
            zIndex: 70,
            backdropFilter: 'blur(2px)',
          }}
        />
      )}

      <aside style={{
        width: W,
        minHeight: isMobile ? '100dvh' : '100vh',
        background: '#0a111e',
        borderRight: '1px solid var(--admin-surf2)',
        display: 'flex',
        flexDirection: 'column',
        position: isMobile ? 'fixed' : 'sticky',
        top: 0,
        left: 0,
        height: isMobile ? '100dvh' : '100vh',
        flexShrink: 0,
        transition: 'width 220ms ease-out, transform 220ms ease-out',
        overflow: 'hidden',
        transform: isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)',
        zIndex: isMobile ? 80 : 'auto',
        boxShadow: isMobile && isOpen ? '8px 0 24px rgba(0,0,0,0.4)' : 'none',
      }}>

        {/* Toggle */}
        <div style={{
          padding: '12px',
          borderBottom: '1px solid var(--admin-surf2)',
          display: 'flex',
          justifyContent: showLabels ? 'space-between' : 'center',
          alignItems: 'center',
        }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            title={isMobile ? 'Fechar menu' : (isOpen ? 'Colapsar menu' : 'Expandir menu')}
            aria-label={isMobile ? 'Fechar menu' : (isOpen ? 'Colapsar menu' : 'Expandir menu')}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--admin-text-2)',
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
            {isMobile ? (
              <svg width={18} height={18} viewBox="0 0 18 18" fill="none">
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" />
              </svg>
            ) : (
              <>
                <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
                <span style={{ display: 'block', width: 16, height: 1.5, background: 'currentColor', borderRadius: 1 }} />
              </>
            )}
          </button>
          {isMobile && (
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--admin-muted)', textTransform: 'uppercase', letterSpacing: '1.5px', marginRight: 8 }}>
              Menu
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ padding: '12px 8px', flex: 1, overflowY: 'auto' }}>
          {NAV.map((item) => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => { if (isMobile) setIsOpen(false) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 12px',
                  minHeight: 44,
                  borderRadius: 8,
                  textDecoration: 'none',
                  marginBottom: 2,
                  background: isActive ? 'var(--admin-surf2)' : 'transparent',
                  color: isActive ? 'var(--admin-text)' : 'var(--admin-text-2)',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  transition: 'all 100ms',
                  position: 'relative',
                  justifyContent: showLabels ? 'flex-start' : 'center',
                }}
                title={!showLabels ? item.label : undefined}
              >
                <span style={{ flexShrink: 0, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                {showLabels && (
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
        <div style={{ borderTop: '1px solid var(--admin-surf2)' }}>
          {showLabels && (
            <div style={{ padding: '8px 8px 12px' }}>
              <Link href="/" onClick={() => { if (isMobile) setIsOpen(false) }} style={{ fontSize: 12, color: 'var(--admin-text-2)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6, padding: '0 8px', minHeight: 44, borderRadius: 6 }}>
                <svg width={12} height={12} viewBox="0 0 12 12" fill="none">
                  <path d="M8 2L4 6l4 4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Portal do Cliente
              </Link>
            </div>
          )}
        </div>

      </aside>
    </>
  )
}
