import { Component, Input, OnInit } from "@angular/core";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-tarjeta-producto",
  templateUrl: "./tarjeta-producto.component.html",
  styleUrls: ["./tarjeta-producto.component.css"],
})
export class TarjetaProductoComponent implements OnInit {
  @Input() public producto: Producto;

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {
  }

  ngOnInit(): void {
  }

  public eliminarProducto(producto: Producto): void {
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
        this.productoService
          .deleteProduct(producto.id)
          .subscribe((jsonProducto) => (this.producto = jsonProducto));
        Swal.fire(
          "Eliminado!",
          `El producto ${producto.nombre} ha sido eliminado exitosamente!.`,
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }
    });
  }

  //Agrega el producto al carrito
  public agregarCarrito(producto: Producto): void {
    this.carritoService.addProductoPedido(producto);
    Swal.fire("Listo!", "El articulo se agrego al carrito", "success");
  }
}
