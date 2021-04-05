import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Usuario } from "src/app/entity/usuario";
import { AuthService } from "src/app/service/Auth.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  public formRegistro = false;
  public formPassword = false;

  public usuario:Usuario;

  constructor(private authService:AuthService,
               private router:Router) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      Swal.fire("Login", `${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(["/"]);  
    }
  }


  public login():void{
    if(this.usuario.username==null || this.usuario.password==null){
    Swal.fire("Error login","Usuario o password vacías!","error");
    return;
    }

    this.authService.login(this.usuario).subscribe(jsonUsuario=>{
     // console.log(jsonUsuario);

      this.authService.guardarUsuario(jsonUsuario.access_token);
      this.authService.guardarToken(jsonUsuario.access_token);

      this.router.navigate(["/"]);
      Swal.fire("Login",`Bienvenido ${this.usuario.username} has iniciado sesion con éxito`,'success')
    },err=>{
        if(err.status==400){
          Swal.fire("Error login","Usuario o password incorrectos!","error");
        }
    });

  }
}
