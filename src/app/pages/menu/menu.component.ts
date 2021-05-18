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

  public productos:Producto[]=[];

  inputForm = new FormControl('');
  
  @Output('search')
  searchEmitter = new EventEmitter<string>();
 
  
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
    //Buscar productos desde el evento valueChanges del input
    this.inputForm.valueChanges.pipe(
      debounceTime(300)
    )
    .subscribe(value => this.searchEmitter.emit(value)); 

  } 

  //Listar las categorias
  public cargarCategoria(): void {
    this.productoService.categoriaList().subscribe((categorias) => {
      this.categorias = categorias;
    });
  }

  public buscarProducto(value:string){
    //Buscar formulario desde el evento click    
    this.searchEmitter.emit(value);
  }

  public logout():void{

    Swal.fire({
      title: 'Quieres cerrar tu sesión?',
      text:`Hasta la proxima ${this.authService.usuario.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, cerrar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Logout",`Hola ${this.authService.usuario.username} has cerrado sesión con éxito`,"success")
        this.router.navigate(["cliente/login"]);
        this.authService.logout();
      }
    });
  }
  
}
