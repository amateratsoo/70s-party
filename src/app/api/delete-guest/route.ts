import { type NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const countryCode = formData.get('country-code')!.toString()
  const phoneNumber = formData.get('phone-number')!.toString()

  try {
    await prisma.guest.delete({
      where: {
        phoneNumber_countryCode: {
          countryCode,
          phoneNumber
        }
      }
    })

    return NextResponse.json({ status: 200 })
  } catch (error) {
    NextResponse.json({ status: 400 })
    throw error
  }
}
