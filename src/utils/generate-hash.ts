import { BinaryLike, createHash } from 'crypto'

export function generateHash(data: BinaryLike) {
  const hash = createHash('sha256')
  hash.update(data)

  return hash.digest('hex')
}
