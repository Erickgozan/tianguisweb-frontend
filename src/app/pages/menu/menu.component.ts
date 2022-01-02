import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormControl, NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs/operators";
import { Categoria } from "src/app/entity/categoria";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { AuthService } from "src/app/service/Auth.service";
import { CarritoService } from "src/app/service/carrito.service";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";

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
  public isAdmin:boolean=false;
  
  @Output('search')
  searchEmitter = new EventEmitter<string>(); 
  @Output('searchCategoria')
  searchCategoria = new EventEmitter<string>();
  @Output('searchOferta')
  searchOferta = new EventEmitter<boolean>();
  
  
  constructor(
    public router: Router,
    private productoService: ProductoService,
    public carritoService:CarritoService,
    public authService:AuthService
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
  
  //Buscar formulario desde el evento click 
  public buscarProducto(value:string){     
    this.searchEmitter.emit(value);
  }

  public buscarProductoByCategoria(value:string){
    this.searchCategoria.emit(value);
  }

  public buscarProductoByOferta(value:boolean){
    this.searchOferta.emit(value);   
  }

  public logout():void{

    Swal.fire({
      title: 'Cerrar sesión.',
      text:`Hola ${this.authService.usuario.nombre}, ¿Quieres cerrar tu sesión?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Sesión cerrada.",`Hasta la próxima ${this.authService.usuario.nombre}, espero volver a verte pronto por aquí!`,"success")
        this.router.navigate(["cliente/login"]);
        this.authService.logout();
      }
    });
  }
  
}
