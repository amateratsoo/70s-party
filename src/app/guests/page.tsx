'use client'

import { useState, useEffect } from 'react'
import {
  EllipsisVertical,
  CaseSensitiveIcon,
  Voicemail,
  Flag,
  CalendarPlus,
  Search
} from 'lucide-react'

import { baseURL } from '@/constants'

interface Guests {
  name: string
  phoneNumber: string
  countryCode: string
}

export default function Page() {
  const [guests, setGuests] = useState<Guests[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`${baseURL}/api/get-all-guests`)
      const data = await response.json()

      setGuests(data)

      setIsLoading(false)
    })()
  }, [])

  if (isLoading)
    return (
      <main className='bg-slate-50 w-screen h-screen font-sans'>
        <div className='w-full px-4 max-w-[68rem] mx-auto pt-6'>
          <div className='mb-6 px-2 bg-slate-50 rounded-md ring-1 max-w-80 ring-slate-300 overflow-hidden focus-within:ring-black flex items-center'>
            <Search className='size-4 text-slate-500' />
            <input
              type='text'
              placeholder='pesquisar por convidado...'
              className='py-2 pl-2 flex-1 outline-none bg-transparent placeholder:text-slate-500'
            />
          </div>

          <table className='text-start w-full rounded-lg overflow-hidden ring-1 ring-slate-100'>
            <thead className='bg-slate-100 font-serif text-slate-500'>
              <td className='py-2 pl-4'>
                nome
                <CaseSensitiveIcon className='size-5' />
              </td>
              <td>
                código postal
                <Flag className='size-3' />
              </td>
              <td>
                telefone
                <Voicemail className='size-4' />
              </td>
              <td>
                adicionado em
                <CalendarPlus className='size-3' />
              </td>
              <td></td>
            </thead>

            {Array.from({ length: 10 }).map(() => {
              return (
                <tr className='odd:bg-slate-100 border-b border-slate-100 last:border-0 animate-pulse'>
                  <td className='h-9'></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className='py-1.5'></td>
                </tr>
              )
            })}
          </table>
        </div>
      </main>
    )

  return (
    <main className='bg-slate-50 w-screen h-screen font-sans'>
      <div className='w-full px-4 max-w-[68rem] mx-auto pt-6'>
        <div className='mb-6 px-2 bg-slate-50 rounded-md ring-1 max-w-80 ring-slate-300 overflow-hidden focus-within:ring-black flex items-center'>
          <Search className='size-4 text-slate-500' />
          <input
            type='text'
            placeholder='pesquisar por convidado...'
            className='py-2 pl-2 flex-1 outline-none bg-transparent placeholder:text-slate-500'
          />
        </div>

        <table className='text-start w-full rounded-lg overflow-hidden ring-1 ring-slate-100'>
          <thead className='bg-slate-100 font-serif text-slate-500'>
            <td className='py-2 pl-4'>
              nome
              <CaseSensitiveIcon className='size-5' />
            </td>
            <td>
              código postal
              <Flag className='size-3' />
            </td>
            <td>
              telefone
              <Voicemail className='size-4' />
            </td>
            <td>
              adicionado em
              <CalendarPlus className='size-3' />
            </td>
            <td></td>
          </thead>

          {guests.map(({ name, phoneNumber, countryCode }) => {
            return (
              <tr className='odd:bg-slate-100 border-b border-slate-100 last:border-0'>
                <td className='pl-4'>{name}</td>
                <td>{countryCode}</td>
                <td>{phoneNumber}</td>
                <td>12/12/24</td>
                <td className='py-1.5'>
                  <button className='pr-1.5'>
                    <EllipsisVertical className='size-5' />
                  </button>
                </td>
              </tr>
            )
          })}
        </table>
      </div>
    </main>
  )
}
