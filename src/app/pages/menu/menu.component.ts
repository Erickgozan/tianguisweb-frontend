import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Categoria } from "src/app/entity/categoria";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import { ProductoService } from "src/app/service/producto.service";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {

  public categorias: Array<Categoria>;
  public ruta: string;
  public producto:Producto;
  public pedido:Pedido;

  constructor(
    public router: Router,
    private productoService: ProductoService,
    public carritoService:CarritoService
  ) {
    this.producto = new Producto();
    this.pedido = this.carritoService.getPedido();
  }

  ngOnInit(): void {
    this.cargarCategoria();
    
  }

  //Listar las categorias
  public cargarCategoria(): void {
    this.productoService.categoriaList().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  
}
