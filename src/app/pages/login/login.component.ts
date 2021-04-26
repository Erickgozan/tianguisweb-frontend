import { invalid } from "@angular/compiler/src/render3/view/util";
import { Component,  OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  public isVisible=false;

  public form:FormGroup;
  public usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router,
    private formBuilder:FormBuilder) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire("Login", `${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(["/"]);
    }
    this.crearFormulario();
  }

  //Crear el formulario
  public crearFormulario():void{
    this.form = this.formBuilder.group({
      username:['',[Validators.required]],
      password:['',[Validators.required, Validators.minLength(8)]]
    });
  }

  //Validar formulario
  public get usernameInvalido():boolean|undefined{
    return this.form.get("username").invalid && this.form.get("username").touched;
  }

  public get passwordInvalido():boolean|undefined{
    return this.form.get("password").invalid && this.form.get("password").touched;
  }

  public login(): void {

    if(this.form.invalid){
      return Object.values(this.form.controls).forEach(control=>{
        control.markAsTouched();
      });
    }
    this.construirUsuario();
    this.authService.login(this.usuario).subscribe(jsonUsuario => {

      this.authService.guardarUsuario(jsonUsuario.access_token);
      this.authService.guardarToken(jsonUsuario.access_token);

      history.back();
      Swal.fire("Login", `Bienvenido ${this.usuario.username} has iniciado sesion con éxito`, 'success');
    }, err => {
      if (err.status == 400) {
        Swal.fire("Error login", "Usuario o password incorrectos!", "error");
      }
    });

  }

 //Establecer al usuario
  public construirUsuario():void{
    this.usuario.username =  this.form.get("username").value;
    this.usuario.password = this.form.get("password").value;
  }
}
