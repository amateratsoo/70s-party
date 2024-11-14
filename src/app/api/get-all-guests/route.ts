export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const guests = await prisma.guest.findMany()

    return NextResponse.json(guests)
  } catch (error) {
    throw error
  }
}
