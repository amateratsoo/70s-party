'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  EllipsisVertical,
  CaseSensitiveIcon,
  Voicemail,
  Flag,
  CalendarPlus,
  Search
} from 'lucide-react'

import { baseURL } from '@/constants'

import { Popover } from '@/components/ui/popover'
import { Toast } from '@/components/ui/toast'
import type { ToastMessage } from '../page'

interface Guests {
  name: string
  phoneNumber: string
  countryCode: string
  inviteURL: string
  createdAt: Date
}

const toastMessages: Record<string, ToastMessage> = {
  guestDeleted: {
    title: 'Convidado removido',
    description: 'O convidado foi removido com sucesso',
    type: 'good'
  },
  guestNotDeletedError: {
    title: 'Algo deu errado',
    description: 'não foi possível remover o convidado',
    type: 'danger'
  }
}

export default function Page() {
  const [guests, setGuests] = useState<Guests[]>([])
  const [searchGuest, setSearchGuest] = useState('')
  const filteredGuests = guests.filter(
    ({ name, phoneNumber }) =>
      name.toLowerCase().includes(searchGuest.toLowerCase()) ||
      phoneNumber.includes(searchGuest)
  )

  const [isLoading, setIsLoading] = useState(true)
  const [openToast, setOpenToast] = useState(false)

  const router = useRouter()

  const toastMessage = useRef<ToastMessage>({
    title: '',
    description: '',
    type: 'good'
  })

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`${baseURL}/api/get-all-guests`)
      const data = await response.json()

      setGuests(data)

      setIsLoading(false)
    })()
  }, [])

  async function deleteGuest({
    phoneNumber,
    countryCode
  }: {
    phoneNumber: string
    countryCode: string
  }) {
    try {
      const formData = new FormData()

      formData.append('phone-number', phoneNumber)
      formData.append('country-code', countryCode)

      const response = await fetch(`${baseURL}/api/delete-guest`, {
        method: 'POST',
        body: formData
      })

      const { status } = await response.json()

      if (status >= 400) {
        toastMessage.current = toastMessages.guestNotDeletedError
        setOpenToast(true)

        return
      }

      const allGuestsExceptTheDeletedOne = guests.filter(guest => {
        if (
          countryCode == guest.countryCode &&
          phoneNumber == guest.phoneNumber
        )
          return false

        return true
      })

      setGuests(allGuestsExceptTheDeletedOne)

      toastMessage.current = toastMessages.guestDeleted
      setOpenToast(true)
    } catch (error) {
      toastMessage.current = toastMessages.guestNotDeletedError
      setOpenToast(true)
      throw error
    }
  }

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

            {Array.from({ length: 10 }).map((_, index) => {
              return (
                <tr
                  className='odd:bg-slate-100 border-b border-slate-100 last:border-0 animate-pulse'
                  key={index}
                >
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
            onChange={({ target }) => setSearchGuest(target.value)}
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

          {guests.length == 0 ||
          (filteredGuests.length == 0 && searchGuest != '') ? (
            <tr className='odd:bg-slate-100 border-b border-slate-100 last:border-0'>
              <td className='pl-4'>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td className='py-1.5'></td>
            </tr>
          ) : searchGuest == '' ? (
            guests.map(
              ({ name, phoneNumber, countryCode, inviteURL, createdAt }) => {
                return (
                  <tr
                    className='odd:bg-slate-100 border-b border-slate-100 last:border-0'
                    key={countryCode + phoneNumber}
                  >
                    <td className='pl-4'>{name}</td>
                    <td>{countryCode}</td>
                    <td>{phoneNumber}</td>
                    <td>{new Date(createdAt).toLocaleDateString()}</td>
                    <td className='py-1.5'>
                      <Popover
                        content={
                          <div className='font-sans flex flex-col w-32'>
                            {/* <span className='font-serif text-base py-1 font-medium'>
                          Opções
                        </span>

                        <div className='w-32 mb-2 h-px bg-slate-300' /> */}

                            {/* <button className='p-1 hover:bg-slate-300/60 focus:bg-slate-300/60 outline-none ring-1 ring-transparent focus:ring-slate-300 transition-colors text-start rounded-md pr-4'>
                              Ver convite
                            </button>
                            <button className='p-1 pr-4 hover:bg-red-300/60 focus:bg-red-300/60 ring-1 ring-transparent focus:ring-red-300 outline-none transition-colors text-red-500 text-start rounded-md'>
                              Eliminar
                            </button> */}

                            <button
                              className='p-1 hover:bg-slate-300/60 transition-colors text-start rounded-md pr-4'
                              onClick={() => {
                                router.push(inviteURL.toString())
                              }}
                            >
                              Ver convite
                            </button>
                            <button
                              className='p-1 pr-4 hover:bg-red-300/60 transition-colors text-red-500 text-start rounded-md'
                              onClick={() =>
                                deleteGuest({
                                  phoneNumber,
                                  countryCode
                                })
                              }
                            >
                              Eliminar
                            </button>
                          </div>
                        }
                      >
                        <button className='p-1 rounded-md focus:bg-slate-300/45 ring-1 ring-transparent focus:ring-slate-300 outline-none hover:bg-slate-300/45 active:bg-slate-300/45'>
                          <EllipsisVertical className='size-4' />
                        </button>
                      </Popover>
                    </td>
                  </tr>
                )
              }
            )
          ) : (
            filteredGuests.map(({ name, phoneNumber, countryCode }) => {
              return (
                <tr
                  className='odd:bg-slate-100 border-b border-slate-100 last:border-0'
                  key={countryCode + phoneNumber}
                >
                  <td className='pl-4'>{name}</td>
                  <td>{countryCode}</td>
                  <td>{phoneNumber}</td>
                  <td>12/12/24</td>
                  <td className='py-1.5'>
                    <Popover
                      content={
                        <div className='font-sans flex flex-col w-32'>
                          {/* <span className='font-serif text-base py-1 font-medium'>
                        Opções
                      </span>

                      <div className='w-32 mb-2 h-px bg-slate-300' /> */}

                          <button className='p-1 hover:bg-slate-300/60 transition-colors text-start rounded-md pr-4'>
                            Ver convite
                          </button>
                          <button className='p-1 pr-4 hover:bg-red-300/60 transition-colors text-red-500 text-start rounded-md'>
                            Eliminar
                          </button>
                        </div>
                      }
                    >
                      <button className='p-1 rounded-md focus:bg-slate-300/45 ring-1 ring-transparent focus:ring-slate-300 outline-none hover:bg-slate-300/45 active:bg-slate-300/45'>
                        <EllipsisVertical className='size-4' />
                      </button>
                    </Popover>
                  </td>
                </tr>
              )
            })
          )}
        </table>
      </div>

      <Toast
        open={openToast}
        setOpen={setOpenToast}
        {...toastMessage.current}
      />
    </main>
  )
}
