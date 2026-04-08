using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductosApi.Data;

namespace ProductosApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductosController : ControllerBase
    {
        private readonly ProductosDbContext _context;

        public ProductosController(ProductosDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerProductos()
        {
            var productos = await _context.PRODUCTOS
                .OrderBy(p => p.NOM_PRO)
                .ToListAsync();

            return Ok(productos);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarProductos([FromQuery] string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                return Ok(new List<object>());
            }

            texto = texto.Trim();

            var productosFiltrados = await _context.PRODUCTOS
                .Where(p =>
                    p.ID_PRO.Contains(texto) ||
                    p.NOM_PRO.Contains(texto))
                .OrderBy(p => p.NOM_PRO)
                .ToListAsync();

            return Ok(productosFiltrados);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerProductoPorId(string id)
        {
            var producto = await _context.PRODUCTOS
                .FirstOrDefaultAsync(p => p.ID_PRO == id);

            if (producto == null)
                return NotFound(new { mensaje = "Producto no encontrado" });

            return Ok(producto);
        }
    }
}