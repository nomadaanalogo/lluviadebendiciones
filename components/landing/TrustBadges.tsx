import { Shield, Truck, RefreshCw, Award, CreditCard, Clock } from 'lucide-react'

const badges = [
  {
    icon: <Truck size={28} className="text-gold" />,
    title: 'Envío a toda Colombia',
    desc: 'Llegamos a los 32 departamentos en 3-5 días hábiles',
  },
  {
    icon: <Shield size={28} className="text-gold" />,
    title: 'Compra 100% segura',
    desc: 'Contraentrega disponible o pago en línea con Wompi',
  },
  {
    icon: <Award size={28} className="text-gold" />,
    title: 'Calidad garantizada',
    desc: 'Materiales premium bañados en oro, duraderos',
  },
  {
    icon: <RefreshCw size={28} className="text-gold" />,
    title: 'Devolución fácil',
    desc: 'Si no quedas satisfecho, te devolvemos tu dinero',
  },
  {
    icon: <CreditCard size={28} className="text-gold" />,
    title: 'Sin cobros ocultos',
    desc: 'Precio final sin sorpresas. Lo que ves es lo que pagas',
  },
  {
    icon: <Clock size={28} className="text-gold" />,
    title: 'Atención 24/7',
    desc: 'Soporte por WhatsApp siempre disponible para ti',
  },
]

export default function TrustBadges() {
  return (
    <section className="py-16 bg-cream" id="garantia">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="gold-divider mb-4">
            <span>✦ ✦ ✦</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-bordo mb-3">
            Tu Confianza es Nuestra Prioridad
          </h2>
          <p className="text-dark/60 max-w-xl mx-auto">
            Compramos con fe y tú compras con tranquilidad. Aquí todas las razones para
            elegirnos.
          </p>
        </div>

        {/* Badges grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="flex items-start gap-4 bg-white rounded-xl p-6 border border-gold/15 hover:border-gold/40 hover:shadow-gold transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-lg bg-bordo/5 flex items-center justify-center flex-shrink-0 border border-gold/20">
                {icon}
              </div>
              <div>
                <h3 className="font-semibold text-dark font-playfair text-lg mb-1">{title}</h3>
                <p className="text-dark/60 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Social proof counter */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 bg-bordo/5 border border-bordo/20 rounded-2xl px-8 py-5">
            <div className="flex -space-x-2">
              {['MF', 'CR', 'AL', 'JP'].map((initials, i) => (
                <div
                  key={i}
                  className="w-9 h-9 rounded-full bg-bordo text-cream text-xs font-bold flex items-center justify-center border-2 border-cream"
                >
                  {initials}
                </div>
              ))}
            </div>
            <div className="text-left">
              <p className="font-bold text-bordo text-lg">
                🛡️ 2,847 familias colombianas
              </p>
              <p className="text-dark/60 text-sm">ya tienen su protección divina</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
