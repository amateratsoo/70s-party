'use client'

import { FormEvent, useEffect, useState } from 'react'
import { parseCookies, setCookie } from 'nookies'
import { useRouter } from 'next/navigation'

import { createJwt } from '@/utils/create-jwt'
import { useAuth } from '../hooks/use-auth'

export default function Page() {
  const router = useRouter()

  const [renderPage, setRenderPage] = useState(false)

  const authToken = parseCookies()['auth-token']
  const isAuthenticated = useAuth(authToken)

  function setAuthToken(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget as HTMLFormElement)
    const password = formData.get('password')

    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

    if (password != adminPassword) return

    const token = createJwt()

    setCookie(null, 'auth-token', token, {
      maxAge: 7 * 24 * 60 * 60 // one week
    })

    router.push('/')
  }

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/')
      return
    }

    setRenderPage(true)
  }, [])

  if (!renderPage) {
    return null
  }

  return (
    <main className='w-screen min-h-screen bg-slate-50 font-sans flex items-center justify-center'>
      <form
        className='w-full px-10 sm:px-0 max-w-[36rem]'
        onSubmit={setAuthToken}
      >
        <div className='mt-6 gap-4 flex flex-col'>
          <label htmlFor='password' className='text-xl font-semibold'>
            Palavra-Passe{' '}
            <span className='rounded-md ml-2 bg-slate-300 p-1 text-sm text-slate-500'>
              dica: fale com o admin 🤫
            </span>
          </label>
          <input
            type='password'
            id='password'
            name='password'
            required
            placeholder='&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;'
            className='py-2 pl-2 flex-1 bg-slate-100 outline-none rounded-md ring-0 ring-slate-300 focus:ring-1'
          />
        </div>

        <button
          type='submit'
          className='disabled:opacity-70 rounded-md bg-blue-500 w-full py-2.5 text-lg font-semibold text-blue-300 my-6 active:scale-95 transition-transform'
        >
          Entrar como admin
        </button>
      </form>
    </main>
  )
}
