import type { Metadata } from 'next'
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'
import OrderForm from '@/components/checkout/OrderForm'
import { Shield, Lock, Truck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hacer Pedido | Lluvia de Bendiciones',
  description: 'Completa tu pedido de Lluvia de Bendiciones. Envío a toda Colombia. Contraentrega disponible.',
  robots: { index: false, follow: false },
}

function CheckoutSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-white rounded-2xl h-48 border border-gray-100" />
      ))}
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream pt-16">
        {/* Header */}
        <div className="bg-bordo-dark border-b border-gold/20 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-playfair text-2xl font-bold text-gold">
                  🛒 Confirmar Pedido
                </h1>
                <p className="text-cream/60 text-sm mt-1">
                  Lluvia de Bendiciones — Colgante Espiritual para Carro
                </p>
              </div>

              {/* Security badges */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                  <Lock size={13} className="text-gold" />
                  <span>Sitio seguro</span>
                </div>
                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                  <Shield size={13} className="text-gold" />
                  <span>100% confiable</span>
                </div>
                <div className="flex items-center gap-1.5 text-cream/60 text-xs">
                  <Truck size={13} className="text-gold" />
                  <span>Envío a Colombia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Suspense fallback={<CheckoutSkeleton />}>
            <OrderForm />
          </Suspense>
        </div>

        {/* Bottom trust bar */}
        <div className="border-t border-gray-200 bg-white py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-6 text-dark/50 text-xs">
              {[
                '🔒 Conexión SSL cifrada',
                '📦 Empaque discreto y seguro',
                '💵 Sin cobros ocultos',
                '📞 Soporte por WhatsApp',
                '↩️ Devolución garantizada',
              ].map((item, i) => (
                <span key={i}>{item}</span>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  )
}
