import { Component, OnInit } from "@angular/core";
import { ProductoService } from "src/app/service/producto.service";
import { Producto } from "src/app/entity/producto";

@Component({
  selector: "app-lista-productos",
  templateUrl: "./lista-productos.component.html",
  styleUrls: ["./lista-productos.component.css"], 
})
export class ListaProductosComponent implements OnInit {
  public productos: Array<Producto>;

  constructor(
    public productoService: ProductoService  ) {}

  ngOnInit(): void {
    //Suscripcion al listados de productos
    this.productoService
      .puductList()
      .subscribe((productos) => (this.productos = productos));
  }
}
