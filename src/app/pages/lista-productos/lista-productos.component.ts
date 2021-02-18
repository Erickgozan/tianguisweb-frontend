import { Component, OnInit } from "@angular/core";
import { ProductoService } from "src/app/service/producto.service";
import { ActivatedRoute } from "@angular/router";
import { Producto } from "src/app/entity/producto";
import Swal from "sweetalert2";

@Component({
  selector: "app-lista-productos",
  templateUrl: "./lista-productos.component.html",
  styleUrls: ["./lista-productos.component.css"],
})
export class ListaProductosComponent implements OnInit {
  public productos: Array<Producto>;

  constructor(
    public productoService: ProductoService,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //Suscripcion al listados de productos
    this.productoService
      .puductList()
      .subscribe((productos) => (this.productos = productos));
  }
 
}
