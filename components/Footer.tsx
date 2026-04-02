import Link from 'next/link'
import { MapPin, Phone, Mail, Shield, Truck, Award } from 'lucide-react'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-dark text-cream">
      {/* Trust bar */}
      <div className="border-b border-gold/20 bg-bordo-dark/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Truck size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-gold text-sm">Envío a toda Colombia</p>
                <p className="text-cream/60 text-xs">En 3-5 días hábiles</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Shield size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-gold text-sm">Pago Seguro</p>
                <p className="text-cream/60 text-xs">Contraentrega disponible</p>
              </div>
            </div>
            <div className="flex items-center gap-3 justify-center sm:justify-end">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Award size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-gold text-sm">Calidad Garantizada</p>
                <p className="text-cream/60 text-xs">Satisfacción asegurada</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-playfair text-2xl font-bold text-gold mb-3">
              ✦ Lluvia de Bendiciones
            </h3>
            <p className="text-cream/70 text-sm leading-relaxed mb-4 max-w-sm">
              Joyería espiritual colombiana diseñada para proteger tu camino y atraer bendiciones
              divinas a tu hogar y vehículo. Cada pieza es elaborada con amor y fe.
            </p>
            <div className="flex items-center gap-2 text-cream/60 text-sm mb-2">
              <MapPin size={14} className="text-gold flex-shrink-0" />
              <span>Colombia</span>
            </div>
            <div className="flex items-center gap-2 text-cream/60 text-sm mb-2">
              <Phone size={14} className="text-gold flex-shrink-0" />
              <a
                href="https://wa.me/573001234567"
                className="hover:text-gold transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                +57 300 123 4567
              </a>
            </div>
            <div className="flex items-center gap-2 text-cream/60 text-sm">
              <Mail size={14} className="text-gold flex-shrink-0" />
              <a
                href="mailto:info@lluviadebendiciones.com"
                className="hover:text-gold transition-colors"
              >
                info@lluviadebendiciones.com
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-playfair font-bold text-gold mb-4 text-lg">Navegación</h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/producto/lluvia-de-bendiciones', label: 'Nuestro Producto' },
                { href: '/checkout', label: 'Comprar' },
                { href: '/seguimiento', label: 'Rastrear Pedido' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/60 hover:text-gold transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-playfair font-bold text-gold mb-4 text-lg">Información</h4>
            <ul className="space-y-2">
              {[
                { href: '#faq', label: 'Preguntas Frecuentes' },
                { href: '#garantia', label: 'Garantía' },
                { href: '#envios', label: 'Envíos y Devoluciones' },
                { href: '#privacidad', label: 'Política de Privacidad' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-cream/60 hover:text-gold transition-colors text-sm"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-cream/40 text-xs text-center sm:text-left">
              &copy; {year} Lluvia de Bendiciones. Todos los derechos reservados.
            </p>
            <p className="text-cream/40 text-xs text-center">
              🇨🇴 Hecho con fe y amor en Colombia
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
