import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import Hero from '@/components/landing/Hero'
import TrustBadges from '@/components/landing/TrustBadges'
import ProductHighlight from '@/components/landing/ProductHighlight'
import Testimonials from '@/components/landing/Testimonials'
import FAQ from '@/components/landing/FAQ'
import BugaBlessing from '@/components/landing/BugaBlessing'
import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Lluvia de Bendiciones | Colgante para Carro | Protección Espiritual Colombia',
  description:
    'Colgante espiritual para carro que atrae bendiciones divinas. Envío a toda Colombia. Contraentrega disponible. Más de 2,847 familias colombianas ya tienen su protección.',
}

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <BugaBlessing />
        <TrustBadges />
        <ProductHighlight />
        <Testimonials />

        {/* CTA Banner */}
        <section className="py-16 bg-gradient-to-r from-bordo-dark via-bordo to-bordo-light relative overflow-hidden">
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 50%, rgba(201,168,76,0.8) 0%, transparent 50%)`,
            }}
          />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="text-gold text-4xl mb-4">✝</div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-cream mb-4">
              Lleva la Protección Divina en tu Camino
            </h2>
            <p className="text-cream/80 text-lg mb-8 max-w-2xl mx-auto">
              Cada viaje es una bendición. Que el Señor guíe tu camino y el de toda
              tu familia. El colgante Lluvia de Bendiciones es tu recordatorio diario
              de Su amor y protección.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/checkout" className="btn-gold inline-flex items-center justify-center gap-3 text-lg">
                <ShoppingBag size={22} />
                Comprar Ahora
              </Link>
              <Link
                href="/producto/lluvia-de-bendiciones"
                className="inline-flex items-center justify-center gap-2 border-2 border-gold/50 text-gold hover:bg-gold/10 px-8 py-4 rounded-lg transition-all font-semibold"
              >
                Ver detalles del producto
              </Link>
            </div>
            <p className="text-cream/50 text-sm mt-6">
              🚚 Envío a toda Colombia · 💵 Contraentrega disponible · ⭐ 4.9/5 en 384 reseñas
            </p>
          </div>
        </section>

        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
