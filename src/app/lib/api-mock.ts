import type { Client, Product } from './types';

const CLIENTES_API_URL = 'http://localhost:5296/api/clientes';
const PRODUCTOS_API_URL = 'http://localhost:5277/api/productos';

function normalizeKeys(obj: any) {
  const normalized: any = {};
  Object.keys(obj).forEach((key) => {
    normalized[key.toLowerCase()] = obj[key];
  });
  return normalized;
}

function mapClienteFromApi(cliente: any): Client {
  console.log('RAW CLIENTE:', cliente);

  const c = normalizeKeys(cliente);
  console.log('CLIENTE NORMALIZADO:', c);

  return {
    id: c['id_cli'] || '',
    name: `${c['nom_cli'] || ''} ${c['ape_cli'] || ''}`.trim(),
    taxId: c['ced_cli'] || '',
    email: c['cor_cli'] || '',
    phone: c['tel_cli'] || '',
    address: c['dir_cli'] || '',
  };
}

function mapProductoFromApi(producto: any): Product {
  console.log('RAW PRODUCTO:', producto);

  const p = normalizeKeys(producto);
  console.log('PRODUCTO NORMALIZADO:', p);

  const stock = Number(p['sto_pro'] || 0);
  const disponibilidad = stock > 0 ? 'En stock' : 'Agotado';

  return {
    id: p['id_pro'] || '',
    code: p['id_pro'] || '',
    name: p['nom_pro'] || '',
    basePrice: Number(p['pre_pro'] || 0),
    availability: disponibilidad,
    description: `Producto disponible en inventario. Stock actual: ${stock}.`,
  };
}

export async function searchClients(query: string): Promise<Client[]> {
  try {
    const url = query.trim()
      ? `${CLIENTES_API_URL}/buscar?texto=${encodeURIComponent(query.trim())}`
      : CLIENTES_API_URL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de clientes.');
    }

    const data = await response.json();
    console.log('CLIENTES API:', data);

    const clientesMapeados = data.map(mapClienteFromApi);
    console.log('CLIENTES MAPEADOS:', clientesMapeados);

    return clientesMapeados;
  } catch (error) {
    console.error('Error al consultar clientes:', error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const url = query.trim()
      ? `${PRODUCTOS_API_URL}/buscar?texto=${encodeURIComponent(query.trim())}`
      : PRODUCTOS_API_URL;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener la lista de productos.');
    }

    const data = await response.json();
    console.log('PRODUCTOS API:', data);

    const productosMapeados = data.map(mapProductoFromApi);
    console.log('PRODUCTOS MAPEADOS:', productosMapeados);

    return productosMapeados;
  } catch (error) {
    console.error('Error al consultar productos:', error);
    return [];
  }
  
}

const VENTAS_API_URL = 'http://localhost:5100/api/ventas';

export async function emitirVenta(
  idCliente: string,
  detalles: { id: string; quantity: number }[]
) {
  try {
    const body = {
      id_CLI: idCliente,
      num_VEN: generarNumeroFactura(),
      detalles: detalles.map(d => ({
        id_PRO: d.id,
        can_VDE: d.quantity,
      })),
    };

    console.log('ENVIANDO VENTA:', body);

    const response = await fetch(`${VENTAS_API_URL}/emitir`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.mensaje || 'Error al emitir venta');
    }

    const data = await response.json();
    console.log('RESPUESTA VENTA:', data);

    return data;
  } catch (error) {
    console.error('Error al emitir venta:', error);
    throw error;
  }
}

function generarNumeroFactura(): string {
  const random = Math.floor(Math.random() * 999999)
    .toString()
    .padStart(6, '0');

  return `001-001-${random}`;
}
