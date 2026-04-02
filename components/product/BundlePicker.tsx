'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Check, Truck } from 'lucide-react'
import { formatCOP, pricePerUnit, savingsPercent } from '@/lib/utils'
import type { Bundle } from '@/lib/types'

interface BundlePickerProps {
  bundles: Bundle[]
  productName: string
}

export default function BundlePicker({ bundles, productName }: BundlePickerProps) {
  const router = useRouter()
  const [selectedBundle, setSelectedBundle] = useState<Bundle>(
    bundles.find((b) => b.quantity === 4) || bundles[0]
  )

  const basePrice = bundles.find((b) => b.quantity === 1)?.price || 35000

  const handleBuyNow = () => {
    const params = new URLSearchParams({
      product: 'lluvia-de-bendiciones',
      qty: selectedBundle.quantity.toString(),
      total: selectedBundle.price.toString(),
    })
    router.push(`/checkout?${params.toString()}`)
  }

  return (
    <div>
      <h3 className="font-playfair text-xl font-bold text-dark mb-4">
        Elige tu paquete
      </h3>

      {/* Bundle options */}
      <div className="space-y-3 mb-6">
        {bundles.map((bundle) => {
          const perUnit = pricePerUnit(bundle.price, bundle.quantity)
          const savings = bundle.quantity * basePrice - bundle.price
          const savePct = bundle.quantity > 1 ? savingsPercent(bundle.quantity * basePrice, bundle.price) : 0
          const isSelected = selectedBundle.id === bundle.id
          const isBest = bundle.quantity === 4

          return (
            <button
              key={bundle.id}
              onClick={() => setSelectedBundle(bundle)}
              className={`w-full text-left bundle-option relative ${isSelected ? 'selected' : ''}`}
            >
              {/* Badge */}
              {bundle.badge && (
                <div
                  className={`absolute -top-3 left-3 text-xs font-bold px-3 py-1 rounded-full
                  ${isBest ? 'bg-bordo text-cream' : 'bg-gold text-dark'}`}
                >
                  {bundle.badge} {bundle.label?.toUpperCase()}
                </div>
              )}

              <div className={`flex items-center justify-between ${bundle.badge ? 'pt-3' : ''}`}>
                <div className="flex items-center gap-3">
                  {/* Selection indicator */}
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors
                    ${isSelected ? 'border-bordo bg-bordo' : 'border-gray-300'}`}
                  >
                    {isSelected && <Check size={12} className="text-white" />}
                  </div>

                  <div>
                    <p className="font-bold text-dark">
                      {bundle.quantity === 1
                        ? '1 Colgante'
                        : `${bundle.quantity} Colgantes`}
                    </p>
                    <p className="text-sm text-dark/50">
                      {formatCOP(perUnit)} por unidad
                      {savings > 0 && (
                        <span className="text-green-600 font-semibold ml-2">
                          · -{savePct}% descuento
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {savings > 0 && (
                    <p className="text-dark/40 text-xs line-through">
                      {formatCOP(bundle.quantity * basePrice)}
                    </p>
                  )}
                  <p className={`font-bold text-lg ${isSelected ? 'text-bordo' : 'text-dark'}`}>
                    {formatCOP(bundle.price)}
                  </p>
                  {savings > 0 && (
                    <p className="text-green-600 text-xs font-semibold">
                      Ahorras {formatCOP(savings)}
                    </p>
                  )}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Shipping note */}
      <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5 mb-5">
        <Truck size={16} className="flex-shrink-0" />
        <span>
          {selectedBundle.quantity >= 2
            ? '🎉 ¡Envío GRATIS incluido en tu pedido!'
            : 'Envío gratis comprando 2 o más unidades (+$8.000)'}
        </span>
      </div>

      {/* Buy button */}
      <button
        onClick={handleBuyNow}
        className="btn-gold w-full flex items-center justify-center gap-3 text-lg font-bold py-4"
      >
        <ShoppingBag size={22} />
        Comprar Ahora — {formatCOP(selectedBundle.price)}
      </button>

      {/* Selected summary */}
      <div className="mt-4 text-center text-sm text-dark/50">
        <p>
          {selectedBundle.quantity} {selectedBundle.quantity === 1 ? 'colgante' : 'colgantes'} ×{' '}
          {formatCOP(pricePerUnit(selectedBundle.price, selectedBundle.quantity))} = {' '}
          <strong className="text-dark">{formatCOP(selectedBundle.price)}</strong>
        </p>
      </div>
    </div>
  )
}
