'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { parseCookies } from 'nookies'

import { useAuth } from '@/hooks/use-auth'

const links = [
  { name: 'Código QR', path: '/' },
  { name: 'Convidados', path: '/guests' }
]

const p = ['/', '/guests']

export function NavBar() {
  const pathname = usePathname()
  const authToken = parseCookies()['auth-token']
  const isAuthenticated = useAuth(authToken)
  const [showNavBar, setShowNavBar] = useState(true)
  const lastScrollPosition = useRef(0)
  const isScrolling = useRef(false)

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling.current) return

      isScrolling.current = true
      requestAnimationFrame(() => {
        const currentScrollPosition = window.scrollY
        const isScrollingDown =
          currentScrollPosition > lastScrollPosition.current

        setShowNavBar(!isScrollingDown)
        lastScrollPosition.current = currentScrollPosition
        isScrolling.current = false
      })
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!p.includes(pathname) || !isAuthenticated) return null

  return (
    <div
      className={`fixed bottom-0 w-full flex items-center justify-center transition-all pointer-events-none ${
        !showNavBar && 'translate-y-full opacity-0'
      }`}
    >
      <ul className='pointer-events-auto rounded-lg p-2 py-4 bg-slate-200/60 ring-1 ring-slate-300 font-serif mb-7 backdrop-blur-sm'>
        {links.map(({ name, path }) => {
          return (
            <li key={path} className='inline'>
              <Link
                className={`rounded-md p-5 py-3 ${
                  pathname == path && 'bg-slate-300'
                }`}
                href={path}
              >
                {name}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
