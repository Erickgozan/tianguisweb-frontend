import { Component, OnInit } from "@angular/core";
import { ProductoService } from "src/app/service/producto.service";
import { Producto } from "src/app/entity/producto";
import { ActivatedRoute } from "@angular/router";


@Component({
  selector: "app-lista-productos",
  templateUrl: "./lista-productos.component.html",
  styleUrls: ["./lista-productos.component.css"],
})
export class ListaProductosComponent implements OnInit {

  public productos: Array<Producto>;
  public productoPaginador: any[];
  public filtro_valor: string = "";


  constructor(public productoService: ProductoService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.filtro_valor = params.get("nombre");
      if (this.filtro_valor == null && this.productos == undefined) {
        this.listadoPaginado();
      } else {
        this.listadoPorNombre();
      }
    });
  }

  //Listados de productos paginados
  listadoPaginado(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get("page");
      if (!page) {
        page = 0;
      }
      this.productoService.puductList(page).subscribe(json => {
        (this.productos = json.content as Producto[]),
          this.productoPaginador = json;
      });
    });
  }

  //Listado paginado de busqueda por nombre
  listadoPorNombre(): void {
    this.productoService.findProductoByNombre(this.filtro_valor).subscribe(jproductos => {
        this.productos = jproductos;
    });
  }

}
