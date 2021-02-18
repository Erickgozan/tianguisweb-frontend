import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Categoria } from "src/app/entity/categoria";
import { Producto } from "src/app/entity/producto";
import { CategoriaService } from "src/app/service/categoria.service";
import { ProductoService } from "src/app/service/producto.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  public categorias: Array<Categoria>;
  public ruta: string;

  constructor(
    public router: Router,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.cargarCategoria();
  }

  //Listar las catgorias
  public cargarCategoria(): void {
    this.productoService.categoriaList().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }
}
