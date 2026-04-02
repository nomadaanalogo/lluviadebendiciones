import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import BundlePicker from '@/components/product/BundlePicker'
import UrgencyTimer from '@/components/product/UrgencyTimer'
import ReviewsSection from '@/components/product/ReviewsSection'
import Link from 'next/link'
import { Check, Star, Truck, Shield, ChevronRight, Home } from 'lucide-react'
import type { Product, Bundle, Review } from '@/lib/types'
import { formatCOP } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Lluvia de Bendiciones | Colgante Espiritual para Carro | Colombia',
  description:
    'Colgante espiritual para carro hecho con amor y fe. Protección divina en cada kilómetro. Envío a toda Colombia. Desde $35.000 COP.',
  openGraph: {
    title: 'Lluvia de Bendiciones - Colgante Espiritual para Carro',
    description: 'Protege tu vehículo con el colgante más amado por familias colombianas.',
    type: 'website',
  },
}

// Static fallback data for when DB is not configured
const STATIC_PRODUCT: Product = {
  id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  name: 'Lluvia de Bendiciones',
  slug: 'lluvia-de-bendiciones',
  description: `El colgante "Lluvia de Bendiciones" es una pieza espiritual única diseñada para proteger tu vehículo y a todos sus ocupantes. Elaborado con materiales de alta calidad y consagrado con oraciones de bendición, este amuleto sagrado invita la protección divina en cada kilómetro de tu camino.

Cada colgante lleva consigo energías positivas y una poderosa oración de protección. El diseño elegante combina la fe con la estética, siendo perfecto como regalo espiritual para conductores que ponen su confianza en la protección divina.`,
  short_description: 'Colgante espiritual para carro que atrae bendiciones y protege a toda la familia en el camino.',
  price: 35000,
  images: null,
  stock: 500,
  active: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}

const STATIC_BUNDLES: Bundle[] = [
  { id: '1', product_id: STATIC_PRODUCT.id, quantity: 1, price: 35000, label: null, badge: null, active: true },
  { id: '2', product_id: STATIC_PRODUCT.id, quantity: 2, price: 59900, label: 'Más popular', badge: '🔥 MÁS POPULAR', active: true },
  { id: '3', product_id: STATIC_PRODUCT.id, quantity: 4, price: 79900, label: 'Más vendido', badge: '⭐ MÁS VENDIDO', active: true },
  { id: '4', product_id: STATIC_PRODUCT.id, quantity: 6, price: 99900, label: 'Mejor oferta', badge: '💎 MEJOR OFERTA', active: true },
]

const features = [
  'Material: Aleación de zinc bañada en oro',
  'Acabado premium resistente a la humedad',
  'Cadena con gancho para espejo retrovisor',
  'Dimensiones: 8cm x 4cm aprox.',
  'Viene en estuche de regalo elegante',
  'Bendecido y consagrado individualmente',
  'Ideal como regalo espiritual',
  'Garantía de satisfacción incluida',
]

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Lluvia de Bendiciones',
  description: 'Colgante espiritual para carro que atrae bendiciones divinas y protege a toda la familia.',
  brand: { '@type': 'Brand', name: 'Lluvia de Bendiciones' },
  offers: {
    '@type': 'Offer',
    price: '35000',
    priceCurrency: 'COP',
    availability: 'https://schema.org/InStock',
    url: 'https://lluviadebendiciones.com/producto/lluvia-de-bendiciones',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '384',
  },
}

async function getProductData() {
  try {
    const supabase = createClient()

    const [productRes, bundlesRes, reviewsRes] = await Promise.all([
      supabase.from('products').select('*').eq('slug', 'lluvia-de-bendiciones').single(),
      supabase.from('bundles').select('*').eq('product_id', STATIC_PRODUCT.id).eq('active', true).order('quantity'),
      supabase.from('reviews').select('*').eq('product_id', STATIC_PRODUCT.id).eq('approved', true).order('created_at', { ascending: false }).limit(10),
    ])

    return {
      product: productRes.data || STATIC_PRODUCT,
      bundles: bundlesRes.data?.length ? bundlesRes.data : STATIC_BUNDLES,
      reviews: reviewsRes.data || [],
    }
  } catch {
    return {
      product: STATIC_PRODUCT,
      bundles: STATIC_BUNDLES,
      reviews: [],
    }
  }
}

export default async function ProductPage() {
  const { product, bundles, reviews } = await getProductData()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Navbar />
      <main className="min-h-screen bg-cream pt-16">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-xs text-dark/50">
            <Link href="/" className="flex items-center gap-1 hover:text-bordo transition-colors">
              <Home size={12} />
              Inicio
            </Link>
            <ChevronRight size={12} />
            <span className="text-dark/70 font-medium">{product.name}</span>
          </nav>
        </div>

        {/* Product layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Product images */}
            <div className="space-y-4">
              {/* Main image */}
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-bordo-dark to-bordo flex items-center justify-center overflow-hidden shadow-bordo border border-gold/20 relative">
                <div className="text-center">
                  <div className="text-gold font-playfair text-9xl mb-4">✝</div>
                  <div className="flex items-center justify-center gap-3 text-gold/70 text-xl mb-3">
                    <span>✦</span>
                    <span className="font-playfair text-sm font-semibold tracking-wider text-gold">
                      LLUVIA DE BENDICIONES
                    </span>
                    <span>✦</span>
                  </div>
                  <div className="text-gold/50">🕊️ Colgante Espiritual para Carro</div>
                </div>
                <div className="absolute top-4 right-4 bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-full">
                  ⭐ BESTSELLER
                </div>
                <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  EN STOCK
                </div>
              </div>

              {/* Thumbnails */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: '✝', label: 'Vista frontal' },
                  { icon: '✦', label: 'Detalle' },
                  { icon: '🕊️', label: 'Con estuche' },
                ].map(({ icon, label }) => (
                  <div
                    key={label}
                    className="aspect-square rounded-xl bg-gradient-to-br from-bordo-dark to-bordo border border-gold/20 flex flex-col items-center justify-center cursor-pointer hover:border-gold transition-colors"
                  >
                    <span className="text-gold text-3xl">{icon}</span>
                    <span className="text-gold/50 text-xs mt-1">{label}</span>
                  </div>
                ))}
              </div>

              {/* Features card */}
              <div className="bg-white rounded-2xl p-6 border border-gold/15">
                <h3 className="font-playfair font-bold text-bordo mb-4 text-lg">
                  Características del producto
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                      <Check size={15} className="text-gold flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right: Product info */}
            <div className="space-y-6">
              {/* Product name & rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs bg-bordo/10 text-bordo font-semibold px-3 py-1 rounded-full border border-bordo/20">
                    🕊️ Colgante Espiritual
                  </span>
                  <span className="text-xs bg-green-50 text-green-700 font-semibold px-3 py-1 rounded-full border border-green-200">
                    ✓ En stock
                  </span>
                </div>

                <h1 className="font-playfair text-3xl sm:text-4xl font-bold text-dark mb-3">
                  {product.name}
                </h1>

                <div className="flex items-center gap-3 mb-4">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#C9A84C" className="text-gold" />
                    ))}
                  </div>
                  <span className="font-bold text-dark">4.9</span>
                  <span className="text-dark/50 text-sm">(384 reseñas)</span>
                  <span className="text-dark/30">·</span>
                  <span className="text-dark/50 text-sm">🛡️ 2,847 familias</span>
                </div>

                {product.short_description && (
                  <p className="text-dark/70 leading-relaxed">{product.short_description}</p>
                )}
              </div>

              {/* Pricing */}
              <div className="bg-cream rounded-xl p-4 border border-gold/20">
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-bold text-bordo font-playfair">
                    {formatCOP(product.price)}
                  </span>
                  <span className="text-dark/50 text-sm">por unidad</span>
                </div>
                <p className="text-green-700 text-sm font-semibold mt-1">
                  💰 Ahorra hasta 52% comprando paquetes
                </p>
              </div>

              {/* Urgency timer */}
              <UrgencyTimer stock={product.stock} />

              {/* Bundle picker */}
              <div className="bg-white rounded-2xl p-6 border border-gold/15">
                <BundlePicker bundles={bundles} productName={product.name} />
              </div>

              {/* Delivery info */}
              <div className="space-y-3">
                {[
                  {
                    icon: <Truck size={16} className="text-green-600 flex-shrink-0" />,
                    text: 'Envío GRATIS a toda Colombia en pedidos de 2+ unidades',
                    bold: true,
                  },
                  {
                    icon: <Shield size={16} className="text-bordo flex-shrink-0" />,
                    text: 'Pago contraentrega: pagas cuando recibes tu pedido',
                  },
                  {
                    icon: <span className="text-sm flex-shrink-0">📦</span>,
                    text: 'Empacado con amor en estuche de regalo elegante',
                  },
                  {
                    icon: <span className="text-sm flex-shrink-0">⏱️</span>,
                    text: 'Procesamos tu pedido en 24 horas hábiles',
                  },
                ].map(({ icon, text, bold }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-dark/70">
                    {icon}
                    <span className={bold ? 'font-semibold text-green-700' : ''}>{text}</span>
                  </div>
                ))}
              </div>

              {/* Share on WhatsApp */}
              <div className="border-t border-gray-100 pt-4">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent('Mira este hermoso colgante espiritual para carro: https://lluviadebendiciones.com/producto/lluvia-de-bendiciones')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium transition-colors"
                >
                  💬 Compartir con un amigo por WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Product description */}
          {product.description && (
            <div className="mt-12 bg-white rounded-2xl p-8 border border-gold/15">
              <div className="gold-divider mb-6">
                <span>✦ ✦ ✦</span>
              </div>
              <h2 className="font-playfair text-2xl font-bold text-bordo mb-4 text-center">
                Descripción del Producto
              </h2>
              <div className="prose max-w-none text-dark/70 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}

          {/* Reviews section */}
          <div className="mt-8">
            <ReviewsSection reviews={reviews} productId={product.id} />
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
