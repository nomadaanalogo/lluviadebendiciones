'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, ShoppingBag, Phone } from 'lucide-react'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bordo-dark/95 backdrop-blur-sm border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-playfair font-bold text-gold-light">
              ✦ Lluvia de Bendiciones
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-cream/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/producto/lluvia-de-bendiciones"
              className="text-cream/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Producto
            </Link>
            <Link
              href="/seguimiento"
              className="text-cream/80 hover:text-gold transition-colors text-sm font-medium"
            >
              Seguimiento
            </Link>
            <Link
              href="/checkout"
              className="flex items-center gap-2 bg-gold text-dark font-bold px-5 py-2 rounded-lg hover:bg-gold-light transition-all text-sm shadow-gold"
            >
              <ShoppingBag size={16} />
              Comprar
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-cream p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-bordo-dark border-t border-gold/20">
          <div className="px-4 py-4 space-y-3">
            <Link
              href="/"
              className="block text-cream/80 hover:text-gold transition-colors py-2 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Inicio
            </Link>
            <Link
              href="/producto/lluvia-de-bendiciones"
              className="block text-cream/80 hover:text-gold transition-colors py-2 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Producto
            </Link>
            <Link
              href="/seguimiento"
              className="block text-cream/80 hover:text-gold transition-colors py-2 font-medium"
              onClick={() => setIsOpen(false)}
            >
              Rastrear mi pedido
            </Link>
            <div className="pt-2">
              <Link
                href="/checkout"
                className="flex items-center justify-center gap-2 bg-gold text-dark font-bold px-5 py-3 rounded-lg hover:bg-gold-light transition-all"
                onClick={() => setIsOpen(false)}
              >
                <ShoppingBag size={18} />
                Comprar ahora
              </Link>
            </div>
            <div className="pt-2 border-t border-gold/20">
              <a
                href="https://wa.me/573001234567?text=Hola,%20me%20interesa%20el%20colgante%20Lluvia%20de%20Bendiciones"
                className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors py-2 font-medium text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Phone size={16} />
                WhatsApp: +57 300 123 4567
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
