import { generateHash } from './generate-hash'

export function createInviteUrl({
  guestNumber,
  countryCode = 'portugal'
}: {
  guestNumber: string
  countryCode: string
}) {
  let baseURL = document.location.href
  baseURL = baseURL.slice(0, baseURL.length - 1)

  const hash = generateHash(guestNumber)

  const inviteURL = new URL(`${baseURL}/invites/${hash}`)
  inviteURL.searchParams.set('country-code', countryCode || 'portugal')

  return inviteURL
}
