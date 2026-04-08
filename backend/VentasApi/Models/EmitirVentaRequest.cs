namespace VentasApi.Models
{
    public class EmitirVentaRequest
    {
        public string ID_CLI { get; set; } = string.Empty;
        public string NUM_VEN { get; set; } = string.Empty;
        public List<EmitirVentaDetalleRequest> DETALLES { get; set; } = new();
    }
}