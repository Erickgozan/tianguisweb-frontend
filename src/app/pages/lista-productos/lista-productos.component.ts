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
  public filtro_nombre: string = "";
  public filtro_categoria_id: string = "";
  public filtro_oferta: string;

  constructor(public productoService: ProductoService,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.activatedRoute.paramMap.subscribe(params => {
      this.filtro_nombre = params.get("nombre");
      this.filtro_categoria_id = params.get("id");
      this.filtro_oferta = params.get("oferta");

      if (this.filtro_nombre == null && this.productos == undefined
        && this.filtro_categoria_id == null && this.filtro_oferta == null) {
        this.listadoPaginado();
      } else if (this.filtro_nombre) {
        this.listadoPorNombre();
      } else if (this.filtro_categoria_id) {
        this.listadoPorCategoria();
      } else if (this.filtro_oferta) {
        this.listadoPorOferta();
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

  //Listado de busqueda por nombre
  listadoPorNombre(): void {
    this.productoService.findProductosByDatos(this.filtro_nombre).subscribe(jproductos => {
      this.productos = jproductos;
    });
  }

  //Listadio de busqueda por categoria
  listadoPorCategoria(): void {
    this.productoService.findProductosByCategoria(this.filtro_categoria_id).subscribe(jProductos => {
      this.productos = jProductos;
    });
  }

  //Listado de busqueda por oferta
  listadoPorOferta(): void {
    this.productoService.findProductosByOferta(this.filtro_oferta).subscribe(jProductos => {
      this.productos = jProductos;
    })
  }

}
