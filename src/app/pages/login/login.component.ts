import { Component,OnInit} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Email } from "src/app/entity/email";
import { Usuario } from "src/app/entity/usuario";
import { AuthService } from "src/app/service/Auth.service";
import { ClienteService } from "src/app/service/cliente.service";
import { EmailService } from "src/app/service/email.service";
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
  public formEmail:FormGroup;
  public usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router,
    private clienteService:ClienteService,
    private emailService:EmailService,
    private formBuilder:FormBuilder) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire("Login", `${this.authService.usuario.email} ya estás autenticado!`, 'info');
      this.router.navigate(["/"]);
    }
    this.crearFormulario();
    this.crearFormularioEmail();
  }

  //Crear el formulario
  public crearFormulario():void{
    this.form = this.formBuilder.group({
      username:['',[Validators.required]],
      password:['',[Validators.required, Validators.minLength(8)]]
    });
  }
  //Crear el formulario recuperar contraseña

  public crearFormularioEmail():void{
    this.formEmail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]]
    });
  }

  //Validar formulario
  public get usernameInvalido():boolean|undefined{
    return this.form.get("username").invalid && this.form.get("username").touched;
  }

  public get passwordInvalido():boolean|undefined{
    return this.form.get("password").invalid && this.form.get("password").touched;
  }

  public get emailInvalido():boolean|undefined{
    return this.formEmail.get("email").invalid && this.formEmail.get("email").touched;
  }

  public enviarEmail():void{
    if(this.formEmail.invalid){
      return Object.values(this.formEmail.controls).forEach(control=>{
        control.markAsTouched();
      });
    }

    this.clienteService.findCustumerByEmail(this.formEmail.get("email").value).subscribe(jCliente=>{
      //console.log("El cliente: " + jCliente.nombre + " esta en la base de datos!");
      let email:Email = {
          url:"http://localhost:4200/cliente/form/"+jCliente.id,
          name:"Erick Antonio Gonzalez Flores",
          mail:"erick_gonzalez@tianguisweb.com",
          subject:"Recuperacion de contraseña",
          body:"Listo, ahora puedes actualizar tu contraseña dando clic en el enlace de recuperación. \n"+
               "IMPORTANTE:No compartas esta información con nadie, ya que podrían adueñarse de tu cuenta!"
      };  

      this.emailService.sendImail(email).subscribe(jEmail=>{
        Swal.fire("Se envió el email","Revisa tu bandeja de entrada para validar tu email","success");
        console.log(jEmail.menseje);      
      },err=>{
        Swal.fire("Error",`${err.error.error}`,"error");
        console.log(err);
      })
      
    },err=>{
      if(err.status==404 && err.error.error_404){
        Swal.fire("Error!",`${err.error.error_404}`,"error");
      }
    })
    
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

      Swal.fire("Login", `Bienvenido ${jsonUsuario.nombre} has iniciado sesion con éxito`, 'success');
      history.back();

    }, err => {
      if (err.status == 400) {
        Swal.fire("Error login", "Usuario o password incorrectos!", "error");
      }
    });

  }

 

 //Establecer al usuario
  public construirUsuario():void{
    this.usuario.email =  this.form.get("username").value;
    this.usuario.password = this.form.get("password").value;
  }
}
