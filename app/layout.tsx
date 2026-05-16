import type { Metadata } from 'next'
import { Rajdhani, Cinzel, Orbitron } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { GuildSettingsProvider } from '@/contexts/guild-settings-context'
import { MemberScreenshotsProvider } from '@/contexts/member-screenshots-context'
import { MemberDkpProvider } from '@/contexts/member-dkp-context'
import './globals.css'

const rajdhani = Rajdhani({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-rajdhani'
})

const cinzel = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  variable: '--font-cinzel'
})

const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-orbitron'
})

export const metadata: Metadata = {
  title: 'Prosgard Guild Manager',
  description: 'Manage your guild with DKP, loot, events, and more',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${cinzel.variable} ${orbitron.variable}`}>
      <body className="font-sans antialiased bg-background min-h-screen overflow-x-hidden">
        <GuildSettingsProvider>
          <MemberDkpProvider>
            <MemberScreenshotsProvider>
              {children}
            </MemberScreenshotsProvider>
          </MemberDkpProvider>
        </GuildSettingsProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
