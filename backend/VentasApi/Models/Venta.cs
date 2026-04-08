namespace VentasApi.Models
{
    public class Venta
    {
        public string ID_VEN { get; set; } = string.Empty;
        public string ID_CLI { get; set; } = string.Empty;
        public DateTime FEC_VEN { get; set; }
        public string NUM_VEN { get; set; } = string.Empty;
    }
}