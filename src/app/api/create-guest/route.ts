import { NextResponse, type NextRequest } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const { name, phoneNumber, countryCode } = {
    name: formData.get('guest-name')?.toString() || 'Convidado',
    phoneNumber: formData.get('guest-phone-number')?.toString(),
    countryCode: formData.get('country-code')?.toString()
  }

  const guestAlreadyExists = await prisma.guest.findFirst({
    where: {
      phoneNumber,
      countryCode
    }
  })

  if (guestAlreadyExists) {
    return NextResponse.json({
      message: 'o convidado já existe',
      status: 400
    })
  }

  try {
    await prisma.guest.create({
      data: {
        name,
        countryCode,
        phoneNumber: phoneNumber as string
      }
    })
  } catch (error) {
    NextResponse.json({
      message: 'não foi possível cadastrar o convidado',
      status: 400
    })

    throw error
  }

  return NextResponse.json({
    message: 'convidado cadastrado com sucesso',
    status: 200
  })
}
