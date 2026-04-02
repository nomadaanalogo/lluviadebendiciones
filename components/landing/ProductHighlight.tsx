import Link from 'next/link'
import { Check, ShoppingBag, Star } from 'lucide-react'
import { formatCOP } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'

const features = [
  'Material: Aleación de zinc bañada en oro',
  'Acabado premium de larga duración',
  'Incluye cadena con gancho para espejo',
  'Dimensiones: 8cm x 4cm aprox.',
  'Viene en estuche de regalo',
  'Bendecido en Buga ante el Señor de los Milagros',
]

async function getBundles() {
  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('bundles')
      .select('quantity, price, label, badge')
      .eq('active', true)
      .eq('product_id', 'a1b2c3d4-e5f6-7890-abcd-ef1234567890')
      .order('quantity', { ascending: true })

    if (data && data.length > 0) return data
  } catch { /* fallback */ }

  return [
    { quantity: 1, price: 35000, label: null, badge: null },
    { quantity: 2, price: 59900, label: 'Más popular', badge: '🔥' },
    { quantity: 4, price: 79900, label: 'Más vendido', badge: '⭐' },
    { quantity: 6, price: 99900, label: 'Mejor oferta', badge: '💎' },
  ]
}

export default async function ProductHighlight() {
  const bundles = await getBundles()
  const basePrice = bundles[0]?.price ?? 35000

  return (
    <section className="py-20 bg-white" id="producto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="gold-divider mb-4">
            <span>✦ ✦ ✦</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-bordo mb-3">
            Lluvia de Bendiciones
          </h2>
          <p className="text-dark/60 max-w-xl mx-auto">
            El colgante espiritual para carro más amado por las familias colombianas.
            Protección divina en cada viaje.
          </p>

          <div className="flex items-center justify-center gap-2 mt-4">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill="#C9A84C" className="text-gold" />
              ))}
            </div>
            <span className="font-semibold text-dark">4.9</span>
            <span className="text-dark/50 text-sm">(384 reseñas)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Product visual */}
          <div className="sticky top-24">
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-bordo-dark to-bordo flex items-center justify-center overflow-hidden shadow-bordo border border-gold/20">
                <div className="text-center">
                  <div className="text-gold font-playfair text-8xl mb-4">✝</div>
                  <div className="flex items-center justify-center gap-3 text-gold/70 text-lg mb-3">
                    <span>✦</span>
                    <span className="font-playfair text-sm font-semibold tracking-wider text-gold">
                      LLUVIA DE BENDICIONES
                    </span>
                    <span>✦</span>
                  </div>
                  <div className="text-gold/50 text-sm">🕊️ Colgante Espiritual para Carro</div>
                </div>
                <div className="absolute top-0 right-0 m-4 bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-full">
                  ⭐ BESTSELLER
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                {[1, 2, 3].map((n) => (
                  <div
                    key={n}
                    className="w-20 h-20 rounded-lg bg-gradient-to-br from-bordo-dark to-bordo border-2 border-gold/30 flex items-center justify-center cursor-pointer hover:border-gold transition-colors"
                  >
                    <span className="text-gold text-2xl">{n === 1 ? '✝' : n === 2 ? '✦' : '🕊️'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 bg-cream rounded-xl p-5 border border-gold/15">
              <h3 className="font-playfair font-semibold text-bordo mb-3">Características</h3>
              <ul className="space-y-2">
                {features.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                    <Check size={16} className="text-gold flex-shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bundle picker */}
          <div>
            <h3 className="font-playfair text-2xl font-bold text-dark mb-6">
              Elige tu paquete y ahorra más
            </h3>

            <div className="space-y-3 mb-8">
              {bundles.map(({ quantity, price, label, badge }) => {
                const perUnit = Math.round(price / quantity)
                const originalTotal = quantity * basePrice
                const savings = originalTotal - price
                const isBest = quantity === 4

                return (
                  <Link
                    key={quantity}
                    href={`/checkout?qty=${quantity}&bundle=true`}
                    className={`bundle-option block ${isBest ? 'selected' : ''} relative`}
                  >
                    {isBest && (
                      <div className="absolute -top-3 left-4 bg-bordo text-cream text-xs font-bold px-3 py-1 rounded-full">
                        ⭐ MÁS VENDIDO
                      </div>
                    )}
                    {label && !isBest && (
                      <div className="absolute -top-3 left-4 bg-gold text-dark text-xs font-bold px-3 py-1 rounded-full">
                        {badge} {label.toUpperCase()}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isBest ? 'bg-bordo text-cream' : 'bg-gold/20 text-bordo'}`}>
                          x{quantity}
                        </div>
                        <div>
                          <p className="font-bold text-dark">
                            {quantity === 1 ? '1 Colgante' : `${quantity} Colgantes`}
                          </p>
                          <p className="text-dark/50 text-sm">
                            {formatCOP(perUnit)} c/u
                            {savings > 0 && (
                              <span className="text-green-600 font-semibold ml-2">
                                · Ahorras {formatCOP(savings)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        {savings > 0 && (
                          <p className="text-dark/40 text-xs line-through">
                            {formatCOP(originalTotal)}
                          </p>
                        )}
                        <p className={`font-bold text-xl ${isBest ? 'text-bordo' : 'text-dark'}`}>
                          {formatCOP(price)}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>

            <Link
              href="/producto/lluvia-de-bendiciones"
              className="btn-bordo w-full flex items-center justify-center gap-3 text-lg"
            >
              <ShoppingBag size={22} />
              Ver todos los detalles
            </Link>

            <p className="text-center text-dark/50 text-xs mt-4">
              🚚 Envío gratis en pedidos de 2 o más unidades
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
