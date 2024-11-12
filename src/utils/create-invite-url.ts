import { generateHash } from './generate-hash'
import { baseURL } from '@/constants'

export function createInviteUrl({
  guestNumber,
  countryCode = 'portugal'
}: {
  guestNumber: string
  countryCode: string
}) {
  const hash = generateHash(guestNumber)

  const inviteURL = new URL(`${baseURL}/invites/${hash}`)
  inviteURL.searchParams.set('country-code', countryCode || 'portugal')

  return inviteURL
}
