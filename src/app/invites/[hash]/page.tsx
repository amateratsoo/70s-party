'use client'

import { useSearchParams } from 'next/navigation'

export default function Page() {
  const params = useSearchParams()

  return <div>{params.get('country-code')}</div>
}
