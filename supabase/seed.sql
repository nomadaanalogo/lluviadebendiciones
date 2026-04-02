-- Seed data for Lluvia de Bendiciones
-- Run after schema.sql

-- Insert main product
insert into products (id, name, slug, description, short_description, price, images, stock, active)
values (
  'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  'Lluvia de Bendiciones',
  'lluvia-de-bendiciones',
  'El colgante "Lluvia de Bendiciones" es una pieza espiritual única diseñada para proteger tu vehículo y a todos sus ocupantes. Elaborado con materiales de alta calidad y consagrado con oraciones de bendición, este amuleto sagrado invita la protección divina en cada kilómetro de tu camino.

Cada colgante lleva consigo energías positivas y una poderosa oración de protección. El diseño elegante combina la fe con la estética, siendo perfecto como regalo espiritual para conductores que ponen su confianza en la protección divina.

Características:
• Material: Aleación de zinc bañada en oro
• Acabado: Premium con brillo duradero
• Incluye: Cadena de colgar con gancho para espejo retrovisor
• Dimensiones: 8cm x 4cm aproximadamente
• Viene en estuche de regalo

Cada pieza es individualmente revisada y bendecida antes de ser enviada.',
  'Colgante espiritual para carro que atrae bendiciones y protege a toda la familia en el camino. Artesanal y consagrado.',
  35000,
  ARRAY[
    'https://images.unsplash.com/photo-1609151354576-cfcd2e5d4e61?w=800',
    'https://images.unsplash.com/photo-1599623560574-39d485900c95?w=800'
  ],
  500,
  true
);

-- Insert bundles
insert into bundles (product_id, quantity, price, label, badge, active) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 1, 35000, null, null, true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 2, 59900, 'Más popular', '🔥 MÁS POPULAR', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 4, 79900, 'Más vendido', '⭐ MÁS VENDIDO', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 6, 99900, 'Mejor oferta', '💎 MEJOR OFERTA', true);

-- Insert seed reviews (pre-approved)
insert into reviews (product_id, customer_name, rating, comment, approved) values
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'María Fernández', 5, 'Hermoso colgante, lo recibí muy bien empacado. Desde que lo puse en mi carro siento mucha paz al manejar. Lo recomiendo 100%.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Carlos Rodríguez', 5, 'Compré 4 para toda la familia. La calidad es excelente y el detalle del diseño es precioso. Llegó en 3 días a Medellín.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ana Lucía Moreno', 5, 'Un regalo perfecto para mi esposo. Le encantó y dice que ya no maneja sin su protección. Muy bonito y bien elaborado.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Jorge Alberto Pérez', 5, 'Tuve un accidente leve y gracias a Dios y a mi colgante estamos bien. Fe y protección divina. Muy recomendado.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Sandra Milena Castro', 4, 'Muy bonito el producto. El envío tardó un poco más de lo esperado pero valió la pena la espera. Lo recomiendo.', true),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Luis Eduardo Vargas', 5, 'Compré 6 para regalar en navidad a toda la familia. A todos les encantó. El precio es muy justo para la calidad.', true);
