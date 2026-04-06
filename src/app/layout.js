export const metadata = {
  title: 'HBC School SIS',
  description: 'Student Information System for Myanmar Schools',
  manifest: '/manifest.json', // PWA를 위한 설정
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#3730a3" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        {children}
      </body>
    </html>
  )
}