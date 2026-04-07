namespace ProductosApi.Models
{
    public class Producto
    {
        public string ID_PRO { get; set; } = string.Empty;
        public string NOM_PRO { get; set; } = string.Empty;
        public decimal PRE_PRO { get; set; }
        public int STO_PRO { get; set; }
    }
}