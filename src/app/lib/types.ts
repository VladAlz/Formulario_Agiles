export interface Client {
  id: string;
  name: string;
  taxId: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: string;
  code: string;
  name: string;
  basePrice: number;
  availability: 'En stock' | 'Bajo pedido' | 'Agotado';
  description: string;
  stock: number;
}

export interface SaleItem extends Product {
  quantity: number;
  aiDescription?: string;
}

export interface InvoiceTotals {
  subtotal: number;
  tax: number;
  total: number;
}