import type { Metadata } from 'next'
import { Bricolage_Grotesque, Inter } from 'next/font/google'
import './globals.css'

import { NavBar } from '@/components/ui/nav-bar'

export const metadata: Metadata = {
  title: 'Convites'
}

const inter = Inter({
  variable: '--inter',
  subsets: ['latin'],
  weight: ['500', '600', '700']
})

const bricolageGrotesque = Bricolage_Grotesque({
  variable: '--bricolage-grotesque',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700']
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body
        className={`${inter.variable} ${bricolageGrotesque.variable} antialiased bg-slate-50`}
      >
        {children}
        <NavBar />
      </body>
    </html>
  )
}
