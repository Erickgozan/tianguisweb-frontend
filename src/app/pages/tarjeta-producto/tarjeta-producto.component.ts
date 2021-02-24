import { Component, Input, OnInit } from "@angular/core";
import { Producto } from "src/app/entity/producto";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-tarjeta-producto",
  templateUrl: "./tarjeta-producto.component.html",
  styleUrls: ["./tarjeta-producto.component.css"],
})
export class TarjetaProductoComponent implements OnInit {
  
  @Input() public producto: Producto;

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {}

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
      if (result.value) {
        this.productoService.deleteProduct(producto.id).subscribe((prod) => {
          prod !== producto;
        });
        Swal.fire(
          "Eliminado!",
          `El producto ${producto.nombre} ha sido eliminado exitosamente!.`,
          "success"
        ).then((result) => {
          if (result.value) {
            location.reload();
          }
        });
      }
    });
  }
}
