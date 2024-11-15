'use client'

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

  if (!p.includes(pathname) || !isAuthenticated) return null

  return (
    <div className='fixed bottom-0 w-full flex items-center justify-center'>
      <ul className='rounded-lg p-2 py-4 bg-slate-200/60 ring-1 ring-slate-300 font-serif mb-7 backdrop-blur-sm'>
        {links.map(({ name, path }) => {
          return (
            <Link
              key={path}
              className={`rounded-md p-5 py-3 ${
                pathname == path && 'bg-slate-300'
              }`}
              href={path}
            >
              {name}
            </Link>
          )
        })}
      </ul>
    </div>
  )
}
