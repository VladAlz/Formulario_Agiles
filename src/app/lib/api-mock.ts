import type { Client, Product } from './types';

export const mockClients: Client[] = [
  { id: '1', name: 'Juan Pérez', taxId: '12345678-9', email: 'juan.perez@email.com', phone: '555-0101', address: 'Av. Siempre Viva 123' },
  { id: '2', name: 'María García', taxId: '98765432-1', email: 'm.garcia@email.com', phone: '555-0102', address: 'Calle Falsa 456' },
  { id: '3', name: 'Empresa Logística S.A.', taxId: '11223344-5', email: 'contacto@logistica.com', phone: '555-0103', address: 'Zona Industrial Nave 4' },
];

export const mockProducts: Product[] = [
  { id: 'p1', code: 'PRD-001', name: 'Laptop Pro X1', basePrice: 1200, availability: 'En stock', description: 'Computadora de alto rendimiento para profesionales.' },
  { id: 'p2', code: 'PRD-002', name: 'Monitor 4K 27"', basePrice: 350, availability: 'En stock', description: 'Pantalla ultra clara con colores vibrantes.' },
  { id: 'p3', code: 'PRD-003', name: 'Teclado Mecánico RGB', basePrice: 85, availability: 'Bajo pedido', description: 'Switches táctiles y retroiluminación personalizable.' },
  { id: 'p4', code: 'PRD-004', name: 'Mouse Inalámbrico', basePrice: 45, availability: 'En stock', description: 'Diseño ergonómico y batería de larga duración.' },
  { id: 'p5', code: 'PRD-005', name: 'Estación de Carga USB-C', basePrice: 60, availability: 'Agotado', description: 'Carga rápida para múltiples dispositivos.' },
];

export async function searchClients(query: string): Promise<Client[]> {
  // Simulate delay for future API call
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!query) return mockClients;
  return mockClients.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.taxId.includes(query)
  );
}

export async function searchProducts(query: string): Promise<Product[]> {
  // Simulate delay for future API call
  await new Promise(resolve => setTimeout(resolve, 300));
  if (!query) return mockProducts;
  return mockProducts.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.code.toLowerCase().includes(query.toLowerCase())
  );
}