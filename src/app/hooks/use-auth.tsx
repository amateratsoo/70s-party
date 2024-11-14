import jwt from 'jsonwebtoken'
import { parseCookies } from 'nookies'

export function useAuth(token: string) {
  const authCookie = parseCookies()['auth-token']

  if (!authCookie) return false

  const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string

  try {
    const isValidToken = jwt.verify(token, secret)

    if (isValidToken) return true
  } catch (error) {
    console.log(error)
    return false
  }
}
