import jwt from 'jsonwebtoken'

export function createJwt() {
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET as string

  const token = jwt.sign({}, secret, {
    expiresIn: 7 * 24 * 60 * 60 // one week
  })

  return token
}
