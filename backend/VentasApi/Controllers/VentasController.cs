using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using VentasApi.Data;
using VentasApi.Models;

namespace VentasApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VentasController : ControllerBase
    {
        private readonly VentasDbContext _context;

        public VentasController(VentasDbContext context)
        {
            _context = context;
        }

        [HttpPost("emitir")]
        public async Task<IActionResult> EmitirVenta([FromBody] EmitirVentaRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.ID_CLI))
                return BadRequest(new { mensaje = "El cliente es obligatorio." });

            if (string.IsNullOrWhiteSpace(request.NUM_VEN))
                return BadRequest(new { mensaje = "El número de documento es obligatorio." });

            if (request.DETALLES == null || request.DETALLES.Count == 0)
                return BadRequest(new { mensaje = "La venta debe tener al menos un detalle." });

            var numeroDocumentoExiste = await _context.VENTAS
                .AnyAsync(v => v.NUM_VEN == request.NUM_VEN);

            if (numeroDocumentoExiste)
                return BadRequest(new { mensaje = "El número de documento ya existe." });

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                string nuevoIdVenta = await GenerarNuevoIdVenta();

                var venta = new Venta
                {
                    ID_VEN = nuevoIdVenta,
                    ID_CLI = request.ID_CLI,
                    FEC_VEN = DateTime.Now,
                    NUM_VEN = request.NUM_VEN
                };

                _context.VENTAS.Add(venta);

                decimal subtotalGeneral = 0;

                for (int i = 0; i < request.DETALLES.Count; i++)
                {
                    var detalleRequest = request.DETALLES[i];

                    if (detalleRequest.CAN_VDE <= 0)
                        return BadRequest(new { mensaje = $"La cantidad del producto {detalleRequest.ID_PRO} debe ser mayor a 0." });

                    var producto = await _context.PRODUCTOS
                        .FirstOrDefaultAsync(p => p.ID_PRO == detalleRequest.ID_PRO);

                    if (producto == null)
                        return BadRequest(new { mensaje = $"El producto {detalleRequest.ID_PRO} no existe." });

                    if (producto.STO_PRO < detalleRequest.CAN_VDE)
                        return BadRequest(new { mensaje = $"Stock insuficiente para el producto {producto.NOM_PRO}." });

                    decimal precioActual = producto.PRE_PRO;
                    decimal subtotalDetalle = precioActual * detalleRequest.CAN_VDE;
                    subtotalGeneral += subtotalDetalle;

                    string nuevoIdDetalle = await GenerarNuevoIdDetalle(i + 1);

                    var detalle = new VentaDetalle
                    {
                        ID_VDE = nuevoIdDetalle,
                        ID_VEN = nuevoIdVenta,
                        ID_PRO = producto.ID_PRO,
                        PRE_VDE = precioActual,
                        CAN_VDE = detalleRequest.CAN_VDE,
                        SUB_VDE = subtotalDetalle
                    };

                    _context.VENTA_DETALLES.Add(detalle);

                    producto.STO_PRO -= detalleRequest.CAN_VDE;
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                var iva = Math.Round(subtotalGeneral * 0.16m, 2);
                var total = subtotalGeneral + iva;

                return Ok(new
                {
                    mensaje = "Venta emitida correctamente.",
                    idVenta = nuevoIdVenta,
                    numeroDocumento = venta.NUM_VEN,
                    fecha = venta.FEC_VEN,
                    subtotal = subtotalGeneral,
                    iva,
                    total
                });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new
                {
                    mensaje = "Ocurrió un error al emitir la venta.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerVentas()
        {
            var ventas = await _context.VENTAS
                .OrderByDescending(v => v.FEC_VEN)
                .ToListAsync();

            return Ok(ventas);
        }

        [HttpGet("{id}/detalles")]
        public async Task<IActionResult> ObtenerDetallesVenta(string id)
        {
            var ventaExiste = await _context.VENTAS.AnyAsync(v => v.ID_VEN == id);

            if (!ventaExiste)
                return NotFound(new { mensaje = "La venta no existe." });

            var detalles = await _context.VENTA_DETALLES
                .Where(d => d.ID_VEN == id)
                .OrderBy(d => d.ID_VDE)
                .ToListAsync();

            return Ok(detalles);
        }

        private async Task<string> GenerarNuevoIdVenta()
        {
            var ultimoId = await _context.VENTAS
                .OrderByDescending(v => v.ID_VEN)
                .Select(v => v.ID_VEN)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(ultimoId))
                return "VEN001";

            int numero = int.Parse(ultimoId.Substring(3)) + 1;
            return $"VEN{numero:D3}";
        }

        private async Task<string> GenerarNuevoIdDetalle(int incrementoTemporal)
        {
            var ultimoId = await _context.VENTA_DETALLES
                .OrderByDescending(d => d.ID_VDE)
                .Select(d => d.ID_VDE)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(ultimoId))
                return $"VDE{incrementoTemporal:D3}";

            int numero = int.Parse(ultimoId.Substring(3)) + incrementoTemporal;
            return $"VDE{numero:D3}";
        }
    }
}