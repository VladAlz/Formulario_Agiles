'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, User, Package, Trash2, Wand2, Calculator, ReceiptText, FileText, CheckCircle2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generateProductDescription } from '@/ai/flows/generate-product-description-flow';
import type { Client, Product, SaleItem, InvoiceTotals } from './lib/types';
import { searchClients, searchProducts } from './lib/api-mock';

export default function FacturaAgil() {
  const { toast } = useToast();
  const [clientQuery, setClientQuery] = useState('');
  const [productQuery, setProductQuery] = useState('');
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [loadingAI, setLoadingAI] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setClients(await searchClients(''));
      setProducts(await searchProducts(''));
    };
    fetchInitialData();
  }, []);

  const handleClientSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setClientQuery(query);
    setClients(await searchClients(query));
  };

  const handleProductSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setProductQuery(query);
    setProducts(await searchProducts(query));
  };

  const addToCart = (product: Product) => {
    if (product.availability === 'Agotado') {
      toast({ title: "Sin disponibilidad", description: "Este producto no está disponible actualmente." });
      return;
    }
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    toast({ title: "Producto añadido", description: `${product.name} se agregó a la venta.` });
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty < 1) return;
    setCart(cart.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const handleGenerateDescription = async (item: SaleItem) => {
    setLoadingAI(item.id);
    try {
      const result = await generateProductDescription({
        nombre: item.name,
        descripcionBasica: item.description,
        precio: item.basePrice,
        disponibilidad: item.availability,
        caracteristicasAdicionales: `Cantidad en pedido: ${item.quantity}`
      });
      setCart(cart.map(i => i.id === item.id ? { ...i, aiDescription: result } : i));
      toast({ title: "Descripción generada", description: "La IA ha optimizado la descripción del producto." });
    } catch (error) {
      toast({ title: "Error", description: "No se pudo generar la descripción con IA." });
    } finally {
      setLoadingAI(null);
    }
  };

  const calculateTotals = (): InvoiceTotals => {
    const subtotal = cart.reduce((acc, item) => acc + (item.basePrice * item.quantity), 0);
    const tax = subtotal * 0.16; // 16% IVA example
    return { subtotal, tax, total: subtotal + tax };
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary flex items-center gap-2">
            <FileText className="w-10 h-10" />
            Facturaágil
          </h1>
          <p className="text-muted-foreground">Sistema de Facturación Inteligente</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-4 py-1 text-sm">Estado: Operativo</Badge>
          <Badge variant="outline" className="px-4 py-1 text-sm bg-card">SQL Server / .NET Core Ready</Badge>
        </div>
      </header>

      {/* SECCIÓN 1: Clientes y Productos */}
      <section id="section-search" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <User className="w-5 h-5" />
              Gestión de Cliente
            </CardTitle>
            <CardDescription>Busca o selecciona el cliente para esta factura</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por nombre o identificación..." 
                className="pl-10"
                value={clientQuery}
                onChange={handleClientSearch}
              />
            </div>
            <ScrollArea className="h-40 border rounded-md p-2 bg-muted/20">
              <div className="space-y-1">
                {clients.map(client => (
                  <div 
                    key={client.id}
                    className={`p-3 rounded-md cursor-pointer transition-colors flex justify-between items-center ${selectedClient?.id === client.id ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/5'}`}
                    onClick={() => setSelectedClient(client)}
                  >
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className={`text-xs ${selectedClient?.id === client.id ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{client.taxId}</p>
                    </div>
                    {selectedClient?.id === client.id && <CheckCircle2 className="w-4 h-4" />}
                  </div>
                ))}
              </div>
            </ScrollArea>
            {selectedClient && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 space-y-1">
                <p className="text-sm font-semibold text-primary">Detalles Seleccionados:</p>
                <p className="text-sm"><strong>Email:</strong> {selectedClient.email}</p>
                <p className="text-sm"><strong>Dir:</strong> {selectedClient.address}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Package className="w-5 h-5" />
              Catálogo de Productos
            </CardTitle>
            <CardDescription>Añade productos a la venta actual</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Código o nombre del producto..." 
                className="pl-10"
                value={productQuery}
                onChange={handleProductSearch}
              />
            </div>
            <ScrollArea className="h-40 border rounded-md p-2 bg-muted/20">
              <div className="space-y-2">
                {products.map(product => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-card border rounded-md hover:border-primary/50 transition-all">
                    <div>
                      <p className="font-medium text-sm">{product.name} <span className="text-muted-foreground text-xs ml-1">({product.code})</span></p>
                      <div className="flex gap-2 items-center mt-1">
                        <span className="text-accent font-bold text-sm">${product.basePrice}</span>
                        <Badge variant={product.availability === 'En stock' ? 'default' : 'secondary'} className="text-[10px] h-4">
                          {product.availability}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" className="text-primary" onClick={() => addToCart(product)}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </section>

      {/* SECCIÓN 2: Detalles de la Venta y Cálculo */}
      <section id="section-sale" className="animate-in fade-in duration-500">
        <Card className="shadow-lg overflow-hidden">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="flex items-center gap-2 text-primary">
              <Calculator className="w-5 h-5" />
              Artículos de la Venta
            </CardTitle>
            <CardDescription>Configura cantidades y descripciones para la factura</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-[120px]">Precio Unit.</TableHead>
                  <TableHead className="w-[100px]">Cant.</TableHead>
                  <TableHead className="w-[120px]">Subtotal</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cart.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                      No hay productos añadidos a la venta.
                    </TableCell>
                  </TableRow>
                ) : (
                  cart.map(item => (
                    <React.Fragment key={item.id}>
                      <TableRow className="group">
                        <TableCell className="font-mono text-xs">{item.code}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold">{item.name}</span>
                            <span className="text-xs text-muted-foreground truncate max-w-[200px] italic">
                              {item.aiDescription || item.description}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">${item.basePrice}</TableCell>
                        <TableCell>
                          <Input 
                            type="number" 
                            min="1" 
                            value={item.quantity} 
                            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                            className="h-8 w-16"
                          />
                        </TableCell>
                        <TableCell className="font-bold text-accent">${item.basePrice * item.quantity}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              title="Mejorar descripción con IA"
                              className="text-primary hover:bg-primary/10"
                              onClick={() => handleGenerateDescription(item)}
                              disabled={loadingAI === item.id}
                            >
                              <Wand2 className={`w-4 h-4 ${loadingAI === item.id ? 'animate-pulse' : ''}`} />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="text-destructive hover:bg-destructive/10"
                              onClick={() => removeFromCart(item.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      {/* SECCIÓN 3: Resumen y Factura Final */}
      <section id="section-invoice" className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
        <Card className="lg:col-span-2 shadow-xl border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <ReceiptText className="w-5 h-5" />
              Previsualización de Factura
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="border p-8 rounded-lg bg-white shadow-inner text-sm space-y-8">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-primary">FACTURAÁGIL S.A.</h2>
                  <p className="text-xs text-muted-foreground">RUC: 0998877665001</p>
                  <p className="text-xs text-muted-foreground">Dirección Central: Parque Tecnológico Edif. A</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">Factura No: 001-001-0000045</p>
                  <p className="text-xs text-muted-foreground">Fecha: {new Date().toLocaleDateString('es-ES')}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-y py-4">
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Cliente</p>
                  <p className="font-semibold">{selectedClient?.name || 'Consumidor Final'}</p>
                  <p className="text-xs">{selectedClient?.taxId || '-'}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Contacto</p>
                  <p className="text-xs">{selectedClient?.email || '-'}</p>
                  <p className="text-xs">{selectedClient?.phone || '-'}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="grid grid-cols-12 font-bold border-b pb-2 text-[10px] uppercase text-muted-foreground">
                  <span className="col-span-1">Cant</span>
                  <span className="col-span-7">Descripción</span>
                  <span className="col-span-2 text-right">P. Unit</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>
                {cart.map(item => (
                  <div key={item.id} className="grid grid-cols-12 py-2 border-b border-dashed text-xs">
                    <span className="col-span-1">{item.quantity}</span>
                    <span className="col-span-7 flex flex-col">
                      <span className="font-medium">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground line-clamp-1">{item.aiDescription || item.description}</span>
                    </span>
                    <span className="col-span-2 text-right">${item.basePrice.toFixed(2)}</span>
                    <span className="col-span-2 text-right font-semibold">${(item.basePrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <div className="w-48 space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Subtotal:</span>
                    <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>IVA (16%):</span>
                    <span className="font-medium">${totals.tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold text-primary">
                    <span>TOTAL:</span>
                    <span>${totals.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-12 text-center text-[10px] text-muted-foreground italic">
                Gracias por su compra. Esta factura es un comprobante electrónico válido.
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Acciones de Emisión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full h-12 text-lg font-bold gap-2" disabled={cart.length === 0}>
              <ReceiptText className="w-5 h-5" />
              Emitir Factura
            </Button>
            <Button variant="outline" className="w-full gap-2">
              <Plus className="w-4 h-4" />
              Guardar Borrador
            </Button>
            <Separator />
            <div className="p-4 rounded-md bg-accent/5 border border-accent/20">
              <p className="text-xs text-accent font-semibold flex items-center gap-1">
                <Calculator className="w-3 h-3" /> Info de Precios
              </p>
              <p className="text-[10px] text-muted-foreground mt-1">
                Los precios son dinámicos y se actualizan según la disponibilidad sincronizada con los microservicios .NET Core.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Toaster />
    </div>
  );
}