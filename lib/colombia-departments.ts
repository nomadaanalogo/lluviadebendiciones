export interface Department {
  name: string
  cities: string[]
}

export const COLOMBIA_DEPARTMENTS: Department[] = [
  {
    name: 'Bogotá D.C.',
    cities: ['Bogotá D.C.'],
  },
  {
    name: 'Amazonas',
    cities: ['Leticia', 'Puerto Nariño'],
  },
  {
    name: 'Antioquia',
    cities: ['Medellín', 'Bello', 'Itagüí', 'Envigado', 'Apartadó', 'Turbo', 'Rionegro', 'Sabaneta', 'La Estrella', 'Copacabana', 'Girardota', 'Barbosa', 'Caldas', 'Caucasia'],
  },
  {
    name: 'Arauca',
    cities: ['Arauca', 'Arauquita', 'Saravena', 'Tame'],
  },
  {
    name: 'Atlántico',
    cities: ['Barranquilla', 'Soledad', 'Malambo', 'Sabanalarga', 'Baranoa', 'Puerto Colombia'],
  },
  {
    name: 'Bolívar',
    cities: ['Cartagena', 'Magangué', 'El Carmen de Bolívar', 'Mompós', 'Turbaco'],
  },
  {
    name: 'Boyacá',
    cities: ['Tunja', 'Duitama', 'Sogamoso', 'Chiquinquirá', 'Paipa', 'Villa de Leyva'],
  },
  {
    name: 'Caldas',
    cities: ['Manizales', 'La Dorada', 'Chinchiná', 'Riosucio', 'Villamaría'],
  },
  {
    name: 'Caquetá',
    cities: ['Florencia', 'San Vicente del Caguán', 'Puerto Rico'],
  },
  {
    name: 'Casanare',
    cities: ['Yopal', 'Aguazul', 'Paz de Ariporo', 'Villanueva'],
  },
  {
    name: 'Cauca',
    cities: ['Popayán', 'Santander de Quilichao', 'El Bordo', 'Puerto Tejada'],
  },
  {
    name: 'Cesar',
    cities: ['Valledupar', 'Aguachica', 'Codazzi', 'La Paz'],
  },
  {
    name: 'Chocó',
    cities: ['Quibdó', 'Istmina', 'Tumaco'],
  },
  {
    name: 'Córdoba',
    cities: ['Montería', 'Lorica', 'Sahagún', 'Montelíbano', 'Cereté'],
  },
  {
    name: 'Cundinamarca',
    cities: ['Soacha', 'Fusagasugá', 'Facatativá', 'Zipaquirá', 'Chía', 'Mosquera', 'Madrid', 'Funza', 'Sibaté', 'Cajicá', 'Girardot', 'La Mesa'],
  },
  {
    name: 'Guainía',
    cities: ['Inírida'],
  },
  {
    name: 'Guaviare',
    cities: ['San José del Guaviare', 'Calamar'],
  },
  {
    name: 'Huila',
    cities: ['Neiva', 'Pitalito', 'Garzón', 'La Plata'],
  },
  {
    name: 'La Guajira',
    cities: ['Riohacha', 'Maicao', 'Uribia', 'Manaure'],
  },
  {
    name: 'Magdalena',
    cities: ['Santa Marta', 'Ciénaga', 'Fundación', 'El Banco'],
  },
  {
    name: 'Meta',
    cities: ['Villavicencio', 'Acacías', 'Granada', 'Puerto López'],
  },
  {
    name: 'Nariño',
    cities: ['Pasto', 'Tumaco', 'Ipiales', 'La Unión'],
  },
  {
    name: 'Norte de Santander',
    cities: ['Cúcuta', 'Ocaña', 'Pamplona', 'Villa del Rosario', 'Los Patios'],
  },
  {
    name: 'Putumayo',
    cities: ['Mocoa', 'Puerto Asís', 'Orito'],
  },
  {
    name: 'Quindío',
    cities: ['Armenia', 'Calarcá', 'Montenegro', 'La Tebaida', 'Quimbaya'],
  },
  {
    name: 'Risaralda',
    cities: ['Pereira', 'Dosquebradas', 'Santa Rosa de Cabal', 'La Virginia'],
  },
  {
    name: 'San Andrés y Providencia',
    cities: ['San Andrés', 'Providencia'],
  },
  {
    name: 'Santander',
    cities: ['Bucaramanga', 'Floridablanca', 'Girón', 'Piedecuesta', 'Barrancabermeja', 'Socorro', 'San Gil'],
  },
  {
    name: 'Sucre',
    cities: ['Sincelejo', 'Corozal', 'San Marcos'],
  },
  {
    name: 'Tolima',
    cities: ['Ibagué', 'Espinal', 'Melgar', 'Honda', 'Chaparral'],
  },
  {
    name: 'Valle del Cauca',
    cities: ['Cali', 'Buenaventura', 'Palmira', 'Tuluá', 'Buga', 'Cartago', 'Jamundí', 'Yumbo', 'Candelaria'],
  },
  {
    name: 'Vaupés',
    cities: ['Mitú'],
  },
  {
    name: 'Vichada',
    cities: ['Puerto Carreño'],
  },
]

export const DEPARTMENT_NAMES = COLOMBIA_DEPARTMENTS.map((d) => d.name)

export function getCitiesForDepartment(departmentName: string): string[] {
  const dept = COLOMBIA_DEPARTMENTS.find((d) => d.name === departmentName)
  return dept ? dept.cities : []
}
