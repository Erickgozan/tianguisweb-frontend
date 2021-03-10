import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-carrito-producto",
  templateUrl: "./carrito-producto.component.html",
  styleUrls: ["./carrito-producto.component.css"],
})
export class CarritoProductoComponent implements OnInit {
  public pedido: Pedido;

  constructor(private carritoService: CarritoService) {
    this.pedido = carritoService.getPedido();
  }

  ngOnInit(): void {}

  //Actualizar la cantidad del producto
  public actualizarCantidad(producto: Producto, event: any): void {
    this.carritoService.addProductoPedidoChange(producto, event);
  }

  //Elimina el item del producto
  public eliminarProducto(producto: Producto) {
    Swal.fire({
      title: `¿Estas seguro de que deseas eliminar el producto ${producto.nombre}?`,
      text: "Esta operación ya no se puede revertir!",
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
}
