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
import { parseCookies } from 'nookies'

import { baseURL } from '@/constants'

import { Popover } from '@/components/ui/popover'
import { Toast } from '@/components/ui/toast'
import { Modal } from '@/components/ui/modal'
import type { ToastMessage } from '../page'
import { useAuth } from '@/hooks/use-auth'

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

  const [guestToDeleteInfo, setGuestToDeleteInfo] = useState<{
    phoneNumber: string
    countryCode: string
  }>({
    phoneNumber: '',
    countryCode: ''
  })

  const [isLoading, setIsLoading] = useState(true)
  const [openToast, setOpenToast] = useState(false)

  const [openModal, setOpenModal] = useState(false)

  const router = useRouter()

  const toastMessage = useRef<ToastMessage>({
    title: '',
    description: '',
    type: 'good'
  })

  const authToken = parseCookies()['auth-token']
  const isAuthenticated = useAuth(authToken)

  useEffect(() => {
    if (!isAuthenticated) {
      return router.push('/login')
    }

    ;(async () => {
      setIsLoading(true)
      const response = await fetch(`${baseURL}/api/get-all-guests`, {
        cache: 'no-store'
      })
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

  function handleDeleteGuest({
    phoneNumber,
    countryCode
  }: {
    phoneNumber: string
    countryCode: string
  }) {
    setOpenModal(true)
    setGuestToDeleteInfo({
      phoneNumber,
      countryCode
    })
  }

  if (!isAuthenticated) {
    return null
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

          <div className='mb-4 text-slate-500'>
            <span className='rounded-md ml-2 bg-slate-300 p-1 text-sm text-slate-500'>
              -
            </span>{' '}
            convidados registados
          </div>

          <table className='text-start w-full rounded-lg overflow-hidden ring-1 ring-slate-100'>
            <thead className='bg-slate-100 font-serif text-slate-500'>
              <td className='py-2 pl-4'>
                nome
                <CaseSensitiveIcon className='size-5' />
              </td>
              <td>
                código de país
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

            <tbody>
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
            </tbody>
          </table>
        </div>
      </main>
    )

  return (
    <main className='bg-slate-50 w-screen min-h-screen font-sans'>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title='Deseja mesmo remover o convidado?'
      >
        <div className='w-full pt-4'>
          <div className='rounded-md bg-slate-200 p-1 text-sm text-slate-400 w-full'>
            💡Esta ação é irreversível
          </div>

          <div className='pt-6 w-full flex'>
            <button className='flex-1' onClick={() => setOpenModal(false)}>
              Cancelar
            </button>
            <button
              className='flex-1 bg-red-300/60 text-red-500 py-2 rounded-md'
              onClick={() => {
                deleteGuest({
                  phoneNumber: guestToDeleteInfo.phoneNumber,
                  countryCode: guestToDeleteInfo.countryCode
                })

                setOpenModal(false)
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      </Modal>
      <div className='w-full scale-95 px-0 sm:scale-100 sm:px-4 max-w-[68rem] mx-auto pt-6 mb-6'>
        <div className='mb-6 px-2 bg-slate-50 rounded-md ring-1 max-w-80 ring-slate-300 overflow-hidden focus-within:ring-black flex items-center'>
          <Search className='size-4 text-slate-500' />
          <input
            type='text'
            placeholder='pesquisar por convidado...'
            className='py-2 pl-2 flex-1 outline-none bg-transparent placeholder:text-slate-500'
            onChange={({ target }) => setSearchGuest(target.value)}
          />
        </div>

        <div className='mb-4 text-slate-500'>
          <span className='rounded-md ml-2 bg-slate-300 p-1 text-sm text-slate-500'>
            {guests.length}
          </span>{' '}
          convidados registados
        </div>

        <table className='text-start w-full rounded-lg overflow-hidden ring-1 ring-slate-100'>
          <thead className='bg-slate-100 font-serif text-slate-500'>
            <td className='py-2 pl-4'>
              nome
              <CaseSensitiveIcon className='size-5' />
            </td>
            <td>
              código de país
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

          <tbody>
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
                  const formatedCreatedAt = new Date(
                    createdAt
                  ).toLocaleDateString()
                  return (
                    <tr
                      className='odd:bg-slate-100 border-b border-slate-100 last:border-0'
                      key={countryCode + phoneNumber}
                    >
                      <td className='pl-4'>{name}</td>
                      <td>{countryCode}</td>
                      <td>{phoneNumber}</td>
                      <td>{formatedCreatedAt}</td>
                      <td className='py-1.5'>
                        <Popover
                          content={
                            <div className='font-sans flex flex-col w-32'>
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
                                  handleDeleteGuest({
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
              filteredGuests.map(
                ({ name, phoneNumber, countryCode, createdAt, inviteURL }) => {
                  const formatedCreatedAt = new Date(
                    createdAt
                  ).toLocaleDateString()
                  return (
                    <tr
                      className='odd:bg-slate-100 border-b border-slate-100 last:border-0'
                      key={countryCode + phoneNumber}
                    >
                      <td className='pl-4'>{name}</td>
                      <td>{countryCode}</td>
                      <td>{phoneNumber}</td>
                      <td>{formatedCreatedAt}</td>
                      <td className='py-1.5'>
                        <Popover
                          content={
                            <div className='font-sans flex flex-col w-32'>
                              {/* <span className='font-serif text-base py-1 font-medium'>
                          Opções
                        </span>
                        <div className='w-32 mb-2 h-px bg-slate-300' /> */}
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
                                  handleDeleteGuest({
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
            )}
          </tbody>
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
