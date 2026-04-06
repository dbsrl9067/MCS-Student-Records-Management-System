import "./globals.css"; // CSS 연결 확인

export const metadata = {
  title: 'MCS Student Information System',
  description: 'Official Student Records Management for Myanmar Christianity School',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1e3a8a" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
