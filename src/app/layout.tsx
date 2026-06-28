import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import EmergencyBanner from '@/components/EmergencyBanner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Protección Menores Venezuela 2026 - Emergencia Sismos',
  description: 'Sistema seguro de reunificación familiar y protección contra trata de menores en emergencia',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#dc2626',
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <EmergencyBanner />
        <Navbar />
        <main className="container mx-auto px-4 py-4 md:py-6">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-4 md:py-6 mt-8 md:mt-12">
          <div className="container mx-auto px-4 text-center text-xs md:text-sm">
            <p className="text-sm md:text-base">⚠️ <strong>EMERGENCIA NACIONAL</strong> - Sistema Protección Menores Venezuela 2026</p>
            <p className="mt-2">Líneas de emergencia: 911 • 0800-SECUESTRO • 0800-DEFENSOR</p>
            <p className="mt-1 text-xs">Operado con ONGs verificadas: IDENNA, FUNDANA, CECODAP, UNICEF</p>
            <p className="mt-2 text-xs text-gray-400">Acceso público - No requiere cuenta</p>
          </div>
        </footer>
      </body>
    </html>
  )
}