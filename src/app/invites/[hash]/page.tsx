'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import { LoaderCircle } from 'lucide-react'

import { baseURL } from '@/constants'
import { generateQrCode } from '@/utils/generate-qrcode'
import { VirtualTicket } from '@/components/svg/virtual-ticket'

export default function Page() {
  const params = useSearchParams()
  const pathname = usePathname()
  const hash = pathname.split('/')[2]
  const countryCode = params.get('country-code')
  const inviteURL = `${baseURL}/invites/${hash}?country-code=${countryCode}`

  const [qrCodeImage, setQrCodeImage] = useState<string | undefined>(undefined)
  const [guest, setGuest] = useState<{ name: string } | undefined>(undefined)
  const [firsName, lastName] = guest ? guest.name.split(' ') : []

  useEffect(() => {
    generateQrCode(inviteURL).then(image => setQrCodeImage(image))
    ;(async () => {
      try {
        const formData = new FormData()
        formData.append('invite-url', inviteURL)

        const response = await fetch(`${baseURL}/api/get-guest`, {
          method: 'POST',
          body: formData
        })

        if (!response.ok) throw response

        const { data, status } = await response.json()

        if (status >= 400) throw new Error('guest does not exist')

        setGuest(data)
      } catch (error) {
        throw error
      }
    })()
  }, [])

  if (!qrCodeImage || !guest) {
    return (
      <div className='bg-slate-50 w-screen h-screen flex items-center justify-center'>
        <LoaderCircle className='text-slate-300 size-6 animate-spin' />
      </div>
    )
  }

  return (
    <main className='bg-gradient-to-br to-orange-300 via-blue-500 from-emerald-300 min-h-screen w-screen'>
      <div className='w-full h-full flex justify-center relative'>
        <VirtualTicket className='size-[40rem]' />

        <span className='absolute top-72 left-1/2 -translate-x-1/2 -ml-14 text-5xl font-serif text-white font-semibold'>
          {firsName} <br /> {lastName}
        </span>

        <span className='absolute bottom-8 left-1/2 -translate-x-1/2'>
          <Image
            src={qrCodeImage!}
            alt=''
            quality={100}
            className='size-44 rounded-md'
            height={300}
            width={300}
            priority
          />
        </span>
      </div>
    </main>
  )
}
