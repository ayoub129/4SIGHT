import type { Metadata } from 'next'
import { Geist, Geist_Mono, Bebas_Neue } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });
const bebasNeue = Bebas_Neue({ 
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bebas-neue"
});

export const metadata: Metadata = {
  title: '4Sight',
  description: 'The Hands of Chance',
  generator: '4Sight',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${bebasNeue.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
