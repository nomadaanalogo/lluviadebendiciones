import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lluvia de Bendiciones | Colgante para Carro | Protección Espiritual Colombia',
  description:
    'Colgante espiritual para carro que atrae bendiciones y protege a toda la familia en el camino. Envío a toda Colombia. Contraentrega disponible. Más de 2,847 familias colombianas ya tienen su protección divina.',
  keywords: [
    'colgante para carro',
    'amuleto carro Colombia',
    'protección espiritual',
    'lluvia de bendiciones',
    'colgante espejo retrovisor',
    'protección divina carro',
    'regalo espiritual Colombia',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://lluviadebendiciones.com',
    siteName: 'Lluvia de Bendiciones',
    title: 'Lluvia de Bendiciones | Colgante Espiritual para Carro',
    description:
      'Protege tu vehículo y a toda tu familia con nuestro colgante espiritual. Envío a toda Colombia. Más de 2,847 familias ya tienen su protección.',
    images: [
      {
        url: 'https://lluviadebendiciones.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lluvia de Bendiciones - Colgante Espiritual para Carro',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lluvia de Bendiciones | Colgante para Carro Colombia',
    description: 'Protección espiritual para tu vehículo. Envío a toda Colombia.',
  },
  alternates: {
    canonical: 'https://lluviadebendiciones.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'Lluvia de Bendiciones',
              url: 'https://lluviadebendiciones.com',
              description: 'Joyería religiosa y espiritual colombiana',
              address: {
                '@type': 'PostalAddress',
                addressCountry: 'CO',
              },
            }),
          }}
        />
      </head>
      <body className="bg-cream text-dark antialiased">{children}</body>
    </html>
  )
}
