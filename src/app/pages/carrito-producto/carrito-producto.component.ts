import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/entity/cliente";
import { EstadoPedido } from "src/app/entity/estadoPedido.enum";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { AuthService } from "src/app/service/Auth.service";
import { CarritoService } from "src/app/service/carrito.service";
import { ClienteService } from "src/app/service/cliente.service";
import { CompraService } from "src/app/service/compra.service";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-carrito-producto",
  templateUrl: "./carrito-producto.component.html",
  styleUrls: ["./carrito-producto.component.css"],
})
export class CarritoProductoComponent implements OnInit {
  public pedido: Pedido;
  public producto: Producto;
  public cliente: Cliente;

  constructor(private carritoService: CarritoService,
    private clienteService: ClienteService,
    private compraService: CompraService,
    private authService: AuthService,
    private router: Router) {
    this.pedido = carritoService.getPedido();
    this.cliente = new Cliente();
  }

  ngOnInit(): void {

    if (this.authService.token) {
      this.obtenerCliente();
    }

  }

  private obtenerCliente(): void {
    this.clienteService.findCustumerById(this.authService.usuario.id).
      subscribe(jsonClie => this.cliente = jsonClie)
  }

  //Actualizar la cantidad del producto
  public actualizarCantidad(producto: Producto, event: any): void {
    this.carritoService.addProductoPedidoChange(producto, event);
  }

  //Elimina el item del producto
  public eliminarProducto(producto: Producto) {
    Swal.fire({
      title: `Quitar del carrito!`,
      text: `¿Estas seguro de que deseas eliminar el producto ${producto.nombre}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarItem(producto.id);
        Swal.fire(
          "Eliminado!",
          `El producto ${producto.nombre} ha sido eliminado exitosamente!.`,
          "success"
        );
      }
    });
  }

  public generarPedido(item: ItemProducto): void {

    if (this.authService.isAuthenticated()) {

      if (this.cliente.direccion == null) {
        Swal.fire("Bien ya pronto sera tuyo", "Necesitamos saber tu dirección.", "info")
          .then(result => {
            if (result.isConfirmed) {
              this.router.navigate(["cliente/form/direccion", this.authService.usuario.id]);//,
            }
          });
      } else {

        Swal.fire({
          title: 'Confirmar la compra?',
          text: `${item.producto.nombre}`,
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si lo quiero!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.pedido.itemProductos = new Array();
            this.pedido.precioTotal = item.producto.precio;
            this.pedido.itemProductos.push(item);
            if (this.pedido != null) {
              this.compraService.generarCompra(this.pedido).subscribe();
            }
            Swal.fire(
              `Ya es tuyo ${this.pedido.cliente.nombre}!`,
              'Hemos confirmado tu compra.',
              'success'
            ).then(result => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
          }
        });
      }
    } else {
      this.router.navigate(["/cliente/login"]);
    }
  }
}
