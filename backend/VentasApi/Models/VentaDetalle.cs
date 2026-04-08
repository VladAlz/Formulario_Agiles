namespace VentasApi.Models
{
    public class VentaDetalle
    {
        public string ID_VDE { get; set; } = string.Empty;
        public string ID_VEN { get; set; } = string.Empty;
        public string ID_PRO { get; set; } = string.Empty;
        public decimal PRE_VDE { get; set; }
        public int CAN_VDE { get; set; }
        public decimal SUB_VDE { get; set; }
    }
}