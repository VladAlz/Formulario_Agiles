using ClientesApi.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ClientesApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly ClientesDbContext _context;

        public ClientesController(ClientesDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> ObtenerClientes()
        {
            var clientes = await _context.CLIENTES
                .OrderBy(c => c.NOM_CLI)
                .ToListAsync();

            return Ok(clientes);
        }

        [HttpGet("buscar")]
        public async Task<IActionResult> BuscarClientes([FromQuery] string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
            {
                var clientes = await _context.CLIENTES
                    .OrderBy(c => c.NOM_CLI)
                    .ToListAsync();

                return Ok(clientes);
            }

            texto = texto.Trim();

            var clientesFiltrados = await _context.CLIENTES
                .Where(c =>
                    c.NOM_CLI.Contains(texto) ||
                    c.APE_CLI.Contains(texto) ||
                    c.CED_CLI.Contains(texto))
                .OrderBy(c => c.NOM_CLI)
                .ToListAsync();

            return Ok(clientesFiltrados);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerClientePorId(string id)
        {
            var cliente = await _context.CLIENTES
                .FirstOrDefaultAsync(c => c.ID_CLI == id);

            if (cliente == null)
                return NotFound(new { mensaje = "Cliente no encontrado" });

            return Ok(cliente);
        }
    }
}