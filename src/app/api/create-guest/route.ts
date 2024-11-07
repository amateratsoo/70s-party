import { NextResponse, type NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const guest = {
    name: formData.get('guest-name'),
    phoneNumber: formData.get('guest-phone-number'),
    countryCode: formData.get('country-code')
  }

  console.log(guest)

  return NextResponse.json({ message: 'ok', status: 200 })
}
