import { NextResponse, type NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'
import { createInviteUrl } from '@/utils/create-invite-url'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const {
    name,
    phoneNumber,
    countryCode,
    oldGuestPhoneNumber,
    oldGuestCountryCode
  } = {
    name: formData.get('guest-name')?.toString() || 'Convidado',
    phoneNumber: formData.get('guest-phone-number')?.toString(),
    countryCode: formData.get('country-code')?.toString(),
    oldGuestPhoneNumber: formData.get('old-guest-phone-number')?.toString(),
    oldGuestCountryCode: formData.get('old-guest-country-code')?.toString()
  }

  const guestAlreadyExists = await prisma.guest.findFirst({
    where: {
      countryCode,
      phoneNumber
    }
  })

  if (
    guestAlreadyExists &&
    (oldGuestPhoneNumber != phoneNumber || oldGuestCountryCode != countryCode)
  ) {
    return NextResponse.json({
      message: 'o usuário já existe',
      status: 400
    })
  }

  try {
    const inviteURL = createInviteUrl({
      guestNumber: phoneNumber as string,
      countryCode: countryCode as string
    }).toString()

    const createdAt = await prisma.guest.update({
      where: {
        phoneNumber_countryCode: {
          phoneNumber: oldGuestPhoneNumber as string,
          countryCode: oldGuestCountryCode as string
        }
      },

      data: {
        name,
        phoneNumber,
        countryCode,
        inviteURL
      },

      select: {
        createdAt: true
      }
    })

    return NextResponse.json({
      message: 'convidado cadastrado com sucesso',
      status: 200,
      guest: {
        createdAt
      }
    })
  } catch (error) {
    NextResponse.json({
      message: 'não foi possível atualizar o convidado',
      status: 403
    })

    throw error
  }
}
