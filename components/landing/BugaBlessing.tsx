export default function BugaBlessing() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-cream relative overflow-hidden">
      {/* Fondo decorativo */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, #C9A84C 0%, transparent 65%)`,
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Divider superior */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="h-px flex-1 max-w-[80px] bg-gold/40" />
          <span className="text-gold text-2xl">✝</span>
          <span className="h-px flex-1 max-w-[80px] bg-gold/40" />
        </div>

        {/* Sello de Buga */}
        <div className="inline-flex items-center gap-2 bg-bordo/8 border border-gold/30 rounded-full px-5 py-2 mb-6">
          <span className="text-gold text-lg">🙏</span>
          <span className="text-bordo font-semibold text-sm tracking-wider uppercase">
            Bendecido en Buga — El Milagroso
          </span>
          <span className="text-gold text-lg">🙏</span>
        </div>

        <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-bordo mb-4 leading-tight">
          Cada colgante es bendecido ante el{' '}
          <span className="text-gold">Señor de los Milagros de Buga</span>
        </h2>

        <p className="text-dark/70 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
          No es solo un adorno. Antes de llegar a tus manos, cada{' '}
          <strong className="text-bordo">Lluvia de Bendiciones</strong> es llevado
          personalmente al Santuario del Señor de los Milagros en Buga, Valle del Cauca —
          uno de los lugares más sagrados de Colombia — para recibir su bendición especial.
        </p>

        {/* Features de Buga */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: '⛪',
              title: 'Santuario del Milagroso',
              desc: 'Bendecido en el templo más venerado del suroccidente colombiano',
            },
            {
              icon: '✨',
              title: 'Fe que se transmite',
              desc: 'Lleva contigo la gracia y protección del Señor de los Milagros',
            },
            {
              icon: '🕊️',
              title: 'Promesa de protección',
              desc: 'Cada viaje en tu carro bajo la guarda divina del Milagroso',
            },
          ].map(({ icon, title, desc }, i) => (
            <div
              key={i}
              className="bg-white border border-gold/20 rounded-xl p-5 hover:border-gold/50 hover:shadow-gold transition-all duration-300"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h3 className="font-playfair font-bold text-bordo mb-1 text-base">{title}</h3>
              <p className="text-dark/60 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* Cita */}
        <blockquote className="italic text-bordo/70 font-playfair text-lg border-l-4 border-gold pl-5 text-left max-w-xl mx-auto">
          "Que el Señor de los Milagros de Buga ilumine tu camino, proteja tu familia y
          haga llover sobre ti sus más grandes bendiciones en cada viaje."
        </blockquote>

        {/* Divider inferior */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <span className="h-px flex-1 max-w-[80px] bg-gold/40" />
          <span className="text-gold/60 text-sm tracking-widest">✦ ✦ ✦</span>
          <span className="h-px flex-1 max-w-[80px] bg-gold/40" />
        </div>
      </div>
    </section>
  )
}
