'use client'

import { type FormEvent, useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Download, Stars } from 'lucide-react'
import { parseCookies } from 'nookies'
import { useRouter } from 'next/navigation'

import { baseURL } from '@/constants'
import { generateQrCode } from '@/utils/generate-qrcode'
import { createInviteUrl } from '@/utils/create-invite-url'
import { useAuth } from '@/hooks/use-auth'

import { CurlyArrowSvg } from '@/components/svg/curly-arrow-svg'
import { QrCodeSvg } from '@/components/svg/qr-code-svg'
import { Toast } from '@/components/ui/toast'

export interface ToastMessage {
  title: string
  description: string
  type: 'danger' | 'good'
}

const toastMessages: Record<string, ToastMessage> = {
  guestAdded: {
    title: 'Convidado adicionado',
    description: 'já pode partilhar com ele o código QR 🥳',
    type: 'good'
  },
  guestAlreadyExists: {
    title: 'Convidado não adicionado',
    description: 'parece que esse convidado já existe',
    type: 'danger'
  },
  badPhoneNumber: {
    title: 'Formato de número incorreto',
    description: 'certifique-se de colocar um número de telefone válido',
    type: 'danger'
  }
}

export default function Home() {
  const [qrCodeImage, setQrCodeImage] = useState<string | undefined>(undefined)
  const [phoneNumberError, setPhoneNumberError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [openToast, setOpenToast] = useState(false)

  const router = useRouter()

  const toastMessage = useRef<ToastMessage>({
    title: '',
    description: '',
    type: 'good'
  })

  const form = useRef<HTMLFormElement | null>(null)

  async function handleForm(event: FormEvent) {
    event.preventDefault()

    const formData = new FormData(form.current as HTMLFormElement)

    const sanitizedGuestPhoneNumber = (
      formData.get('guest-phone-number') as string
    )
      .trim()
      .replaceAll(' ', '')

    if (
      isNaN(Number(sanitizedGuestPhoneNumber)) ||
      sanitizedGuestPhoneNumber.length > 9
    ) {
      setPhoneNumberError(true)
      ;(
        document.querySelector(
          "input[name='guest-phone-number']"
        ) as HTMLInputElement
      ).focus()

      toastMessage.current = toastMessages.badPhoneNumber
      setOpenToast(true)

      return
    }

    setPhoneNumberError(false)

    const guestName =
      formData.get('guest-name')?.toString().trim() || 'Convidado'
    const countryCode = formData.get('country-code')?.toString() || 'portugal'

    const sanitizedData = new FormData()
    sanitizedData.append('guest-name', guestName as string)
    sanitizedData.append('guest-phone-number', sanitizedGuestPhoneNumber)
    sanitizedData.append('country-code', countryCode)

    setIsLoading(true)

    const response = await fetch(`${baseURL}/api/create-guest`, {
      method: 'POST',
      body: sanitizedData
    })

    if (!response.ok && response.status >= 500) throw response

    const { message, status } = await response.json()
    setIsLoading(false)

    if (status >= 400) {
      if (message == 'o convidado já existe') {
        setPhoneNumberError(true)
        ;(
          document.querySelector(
            "input[name='guest-phone-number']"
          ) as HTMLInputElement
        ).focus()

        toastMessage.current = toastMessages.guestAlreadyExists
        setOpenToast(true)
      }

      return
    }

    const inviteURL = createInviteUrl({
      guestNumber: sanitizedGuestPhoneNumber,
      countryCode: countryCode
    })

    generateQrCode(inviteURL.toString()).then(image =>
      setQrCodeImage(String(image))
    )

    toastMessage.current = toastMessages.guestAdded
    setOpenToast(true)
  }

  const authToken = parseCookies()['auth-token']
  const isAuthenticated = useAuth(authToken)

  useEffect(() => {
    if (!isAuthenticated) {
      return router.push('/login')
    }
  }, [])

  if (!isAuthenticated) {
    return null
  }

  return (
    <main className='w-screen min-h-screen bg-slate-50 flex flex-col md:flex-row justify-start items-center pt-12 font-sans'>
      <form ref={form} onSubmit={handleForm} className='w-full px-10'>
        <div>
          <label htmlFor='phone-number' className='text-xl font-semibold'>
            Número de telefone{' '}
            <span className='rounded-md ml-2 bg-slate-300 p-1 text-sm text-slate-500'>
              Obrigatório
            </span>
          </label>

          <div
            data-show-error={phoneNumberError}
            className='mt-4 rounded-md ring-0 data-[show-error="false"]:ring-slate-300 data-[show-error="true"]:ring-red-500 overflow-hidden focus-within:ring-1 flex'
          >
            <select
              name='country-code'
              defaultValue='portugal'
              className='bg-slate-200 p-2 text-slate-500 outline-none'
            >
              <option value='angola'>+244 🇦🇴</option>
              <option value='portugal'>+351 🇵🇹</option>
            </select>
            <input
              type='text'
              name='guest-phone-number'
              id='phone-number'
              placeholder='925 529 323'
              required
              className='py-2 pl-2 flex-1 bg-slate-100 outline-none'
            />
          </div>
        </div>

        <div className='mt-6 gap-4 flex flex-col'>
          <label htmlFor='name' className='text-xl font-semibold'>
            Nome do convidado{' '}
            <span className='rounded-md ml-2 bg-slate-300 p-1 text-sm text-slate-500'>
              Opcional
            </span>
          </label>
          <input
            type='text'
            id='name'
            name='guest-name'
            placeholder='Pedro Duarte'
            className='py-2 pl-2 flex-1 bg-slate-100 outline-none rounded-md ring-0 ring-slate-300 focus:ring-1'
          />
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='disabled:opacity-70 rounded-md bg-blue-500 w-full py-2.5 text-lg font-semibold text-blue-300 my-6 active:scale-95 transition-transform'
        >
          Gerar código QR 🪄
        </button>
      </form>

      <div className='w-full mt-6 md:mt-0'>
        <div className='relative'>
          <div className='absolute right-12 text-lg text-blue-500 font-semibold font-serif rotate-12 mt-7 md:mt-0 md:-top-32'>
            {qrCodeImage ? 'Obaaa!!! 🤩🎉🎉' : 'O código QR aparecerá aqui 👀'}
            <CurlyArrowSvg className='size-32 rotate-[125deg] fill-blue-600' />
          </div>
        </div>

        <div
          data-is-loading={isLoading}
          className='flex data-[is-loading="true"]:animate-pulse animate-none m-10 h-full max-h-96 sm:mx-auto md:m-auto aspect-square items-center justify-center bg-blue-500 rounded-xl shadow-lg shadow-slate-400 mt-40 mb-10 overflow-hidden'
        >
          {qrCodeImage ? (
            <Image
              src={qrCodeImage}
              alt=''
              quality={100}
              className='size-72'
              height={300}
              width={300}
              priority
            />
          ) : (
            <QrCodeSvg className='size-72 fill-slate-50' />
          )}
        </div>

        {qrCodeImage && (
          <div className='flex flex-col px-10 gap-2 mb-10 w-full sm:w-[29rem] md:w-96 md:px-0 sm:mx-auto md:mt-10 md:mb-0'>
            <a
              className='rounded-md border-2 border-blue-500 w-full py-2.5 text-lg font-semibold text-blue-500 active:scale-95 transition-all flex justify-center items-center gap-2 cursor-pointer hover:bg-blue-500 hover:text-slate-200'
              download='qrcode.png'
              href={qrCodeImage}
            >
              Salvar como imagem
              <Download className='size-5' />
            </a>
            <button
              className='rounded-md border-2 border-blue-500 w-full py-2.5 text-lg font-semibold text-blue-500 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-blue-500 hover:text-slate-200'
              onClick={() => {
                setQrCodeImage(undefined)
                setPhoneNumberError(false)
                form.current?.reset()
              }}
            >
              Limpar tudo
              <Stars className='size-5' />
            </button>
          </div>
        )}
      </div>

      <Toast
        open={openToast}
        setOpen={setOpenToast}
        {...toastMessage.current}
      />
    </main>
  )
}
