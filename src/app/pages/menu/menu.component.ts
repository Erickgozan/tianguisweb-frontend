import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { SocialAuthService, SocialUser } from "angularx-social-login";
import { Categoria } from "src/app/entity/categoria";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { AuthSocialService } from "src/app/service/auth-social.service";
import { AuthService } from "src/app/service/Auth.service";
import { CarritoService } from "src/app/service/carrito.service";
import { ProductoService } from "src/app/service/producto.service";
import { TokenSocialService } from "src/app/service/token-social.service";
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

  public userLogged:SocialUser;
  public isLogged:boolean=false;

  constructor(
    public router: Router,
    private productoService: ProductoService,
    public carritoService:CarritoService,
    public authService:AuthService,
    private socialAuthService: SocialAuthService,
    private oauthService: AuthSocialService,
    private tokenService: TokenSocialService
  ) {
    this.producto = new Producto();
    this.pedido = this.carritoService.getPedido();
  }

  ngOnInit(): void {
    this.cargarCategoria();
    
    this.socialAuthService.authState.subscribe(
      data=>{
        this.userLogged = data;
        this.isLogged = (this.userLogged!=null && this.tokenService.getToken()!=null);
      }
    );
  }


  //Listar las categorias
  public cargarCategoria(): void {
    this.productoService.categoriaList().subscribe((categorias) => {
      this.categorias = categorias;
    });
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
        this.socialAuthService.signOut().then(
          data=>{
            this.tokenService.logOut()
            this.router.navigate(["cliente/login"])
          }
        );
      }
    });
  }
  

 
}
