import './globals.css'
import Navigation from '@/components/Navigation'

export const metadata = {
  title: '01aa',
  description: 'Coming Soon',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  )
}