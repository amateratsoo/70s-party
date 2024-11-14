import { NextRequest, NextResponse } from 'next/server'

import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const inviteURL = formData.get('invite-url')?.toString()

  const guest = await prisma.guest.findFirst({
    where: {
      inviteURL
    },
    select: {
      name: true
    }
  })

  console.log(guest)

  if (!guest) {
    return NextResponse.json({
      status: 400,
      message: 'guest does not exist'
    })
  }

  return NextResponse.json({
    data: guest,
    status: 200
  })
}
