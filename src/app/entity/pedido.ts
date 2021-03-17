import { ItemProducto } from "./itemProducto";
import { Cliente } from "./cliente";
import { EstadoPedido } from "./estadoPedido.enum";

export class Pedido {
  id: string;
  cliente: Cliente;
  productos: Array<ItemProducto>;
  precioTotal: number;
  estado: EstadoPedido;
  createAt: Date;
}
