# **App Name**: Facturaágil

## Core Features:

- Búsqueda y Gestión de Clientes: Permite buscar, seleccionar y visualizar la información básica de clientes, preparando la interfaz para la futura integración con una base de datos SQL Server a través de microservicios.
- Búsqueda y Detalle de Productos: Ofrece una interfaz para buscar productos por nombre o código y mostrar sus detalles, incluyendo el precio actual y una descripción, con una arquitectura lista para conectar a SQL Server.
- Añadir y Configurar Artículos de Venta: Facilita la adición de productos a la lista de venta activa, permitiendo ajustar cantidades para el cálculo automático del total.
- Generador de Descripción de Producto con IA: Una herramienta que, basándose en la información del producto, sugiere o amplía descripciones para la factura, adaptando detalles de disponibilidad o características especiales para su visualización.
- Cálculo Dinámico del Total de Venta: Calcula y actualiza automáticamente los subtotales e impuestos de la venta en tiempo real a medida que se añaden o modifican los productos en la lista.
- Previsualización Detallada de Factura: Muestra un resumen claro y estructurado de todos los productos seleccionados, la información del cliente asociado y el importe total a pagar, imitando el formato de una factura.
- Preparación para Integración con Microservicios .NET Core: Incluye una estructura arquitectónica para el consumo de APIs RESTful que en el futuro se conectarán con microservicios .NET Core y la base de datos SQL Server para clientes y productos.

## Style Guidelines:

- Esquema de color general: Luminoso para enfatizar la claridad y la profesionalidad. Los colores inspiran confianza y eficiencia en las operaciones comerciales.
- Color principal: Púrpura azulado moderno (#6A4DBF). Representa fiabilidad y un enfoque contemporáneo.
- Color de fondo: Una variante muy suave del púrpura azulado principal (#F3ECF7). Proporciona un telón de fondo limpio y de baja distracción.
- Color de acento: Azul profundo y vibrante (#2251D1). Destinado a llamar la atención sobre elementos interactivos y puntos clave de información, ofreciendo un contraste notable.
- Fuente principal: 'Inter' (sans-serif) para titulares y texto de cuerpo. Elegida por su legibilidad, neutralidad y un toque moderno que asegura una experiencia de usuario clara y objetiva en todas las secciones de la factura.
- Utilizar iconos funcionales, minimalistas y de estilo lineal. Estos iconos deben ser intuitivos para representar acciones comunes como buscar, añadir o editar, manteniendo la claridad en la interfaz.
- Disposición en tres secciones principales apiladas verticalmente en la misma pantalla: Cliente y Productos (arriba), Detalles de la Venta (centro) y Resumen de Factura (abajo). Se priorizará un diseño responsivo y amplio uso de espacio en blanco para facilitar la lectura y la navegación.
- Animaciones sutiles y rápidas para proporcionar retroalimentación al usuario, como al añadir un producto, actualizar cálculos o realizar búsquedas. El objetivo es mantener una sensación de fluidez y eficiencia.