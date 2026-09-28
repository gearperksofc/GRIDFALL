import type { Metadata, Viewport } from 'next'
import { Press_Start_2P, Pixelify_Sans } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GAME_CONFIG } from '@/data/config'
import './globals.css'

const pressStart = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-press-start',
  display: 'swap',
})

const pixelify = Pixelify_Sans({
  subsets: ['latin'],
  variable: '--font-pixelify',
  display: 'swap',
})

export const metadata: Metadata = {
  title: GAME_CONFIG.name,
  description: 'Um RPG 2D para jogar no celular e no navegador.',
  applicationName: GAME_CONFIG.name,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: GAME_CONFIG.name,
  },
}

export const viewport: Viewport = {
  themeColor: '#0f0f1f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${pressStart.variable} ${pixelify.variable}`}>
      <body className="min-h-dvh overflow-hidden">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
