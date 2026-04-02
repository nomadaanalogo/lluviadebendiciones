import Link from 'next/link'
import { ShoppingBag, Star, Shield, Truck } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Subtle warm tint */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-cream to-white" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gold/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-bordo/4 blur-2xl" />

        {/* Cross pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(139,30,46,0.8) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139,30,46,0.8) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Decorative cross */}
        <div className="absolute top-16 right-8 sm:right-16 opacity-5 text-bordo text-8xl sm:text-9xl font-playfair select-none">
          ✝
        </div>
        <div className="absolute bottom-20 left-4 sm:left-16 opacity-5 text-gold text-6xl font-playfair select-none">
          ✦
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text content */}
          <div>
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 bg-bordo/5 border border-bordo/20 rounded-full px-4 py-2 mb-6">
              <span className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} fill="#C9A84C" className="text-gold" />
                ))}
              </span>
              <span className="text-bordo text-sm font-medium">
                🛡️ 2,847 familias colombianas ya tienen su protección
              </span>
            </div>

            <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold text-bordo leading-tight mb-6">
              Que Dios{' '}
              <span className="text-gradient-gold">Bendiga</span>{' '}
              Cada Kilómetro de tu Camino
            </h1>

            <p className="text-dark/70 text-lg sm:text-xl leading-relaxed mb-8 max-w-lg">
              El colgante <strong className="text-bordo">Lluvia de Bendiciones</strong> lleva
              protección divina a tu vehículo. Un recordatorio sagrado de que no estás solo
              en el camino.
            </p>

            {/* Price highlight */}
            <div className="flex items-center gap-4 mb-8">
              <div>
                <p className="text-dark/50 text-sm">Desde solo</p>
                <p className="text-3xl font-bold text-gold">$35.000 COP</p>
              </div>
              <div className="h-12 w-px bg-bordo/15" />
              <div>
                <p className="text-dark/50 text-sm">Pack de 4 por</p>
                <p className="text-3xl font-bold text-gold">$79.900 COP</p>
                <p className="text-green-600 text-xs font-semibold">Ahorras $60.100</p>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/checkout"
                className="btn-gold inline-flex items-center justify-center gap-3 text-lg font-bold"
              >
                <ShoppingBag size={22} />
                Comprar Ahora
              </Link>
              <Link
                href="/producto/lluvia-de-bendiciones"
                className="inline-flex items-center justify-center gap-2 border-2 border-bordo/40 text-bordo hover:bg-bordo/5 px-8 py-4 rounded-lg transition-all font-semibold text-lg"
              >
                Ver Producto
              </Link>
            </div>

            {/* Mini trust badges */}
            <div className="flex flex-wrap gap-4">
              {[
                { icon: <Truck size={16} />, text: 'Envío a toda Colombia' },
                { icon: <Shield size={16} />, text: 'Contraentrega disponible' },
                { icon: '🙏', text: 'Bendecido y consagrado' },
              ].map(({ icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-dark/60 text-sm">
                  <span className="text-gold">{icon}</span>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Product visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              {/* Main product display */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 animate-float">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gold/10 blur-2xl scale-110" />

                {/* Main circle */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cream via-white to-cream border-2 border-gold/40 flex items-center justify-center overflow-hidden shadow-gold">
                  {/* Inner decorative pattern */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at center, rgba(201,168,76,0.4) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Cross ornament */}
                  <div className="relative z-10 flex flex-col items-center gap-4">
                    <div className="text-bordo font-playfair text-7xl sm:text-8xl leading-none drop-shadow-sm">
                      ✝
                    </div>
                    <div className="flex items-center gap-3 text-gold text-2xl">
                      <span>✦</span>
                      <span className="text-bordo text-sm font-playfair font-semibold text-center leading-tight">
                        LLUVIA DE<br />BENDICIONES
                      </span>
                      <span>✦</span>
                    </div>
                    <div className="text-gold text-sm tracking-widest">🕊️</div>
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-gold text-dark text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ⭐ BESTSELLER
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  ✓ EN STOCK
                </div>
              </div>

              {/* Decorative elements around */}
              <div className="absolute -top-8 -left-8 text-gold/20 text-5xl font-playfair">✦</div>
              <div className="absolute -bottom-8 -right-8 text-gold/20 text-5xl font-playfair">✦</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 40L60 35C120 30 240 20 360 25C480 30 600 50 720 55C840 60 960 50 1080 40C1200 30 1320 20 1380 15L1440 10V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z"
            fill="#FAF8F5"
          />
        </svg>
      </div>
    </section>
  )
}
