import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validator, Validators } from "@angular/forms";
import { Cliente } from "src/app/entity/cliente";
import { Role } from "src/app/entity/role";
import { AuthService } from "src/app/service/Auth.service";
import { ClienteService } from "src/app/service/cliente.service";
import { RoleService } from "src/app/service/role.service";
import { ValidadoresService } from "src/app/service/validadores.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.css"],
})
export class ClienteComponent implements OnInit {

  public cliente: Cliente;
  public role_user: Role;
  public errores: Array<string>;

  public form: FormGroup;


  constructor(
    private clienteService: ClienteService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private validadores: ValidadoresService,
    private authService:AuthService
  ) {
    this.cliente = new Cliente();
    this.role_user = new Role();
    this.cliente.roles = new Array();
  }

  ngOnInit(): void {
    this.crearFormulario();
    this.listarRoles();
  }

  //Construir el formulario
  public crearFormulario(): void {
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.minLength(5)]],
      apellido: ['', [Validators.required, Validators.minLength(5)]],
      telefono: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$")]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password2: ['', [Validators.required]],

    }, {
      validators: this.validadores.validarPassword('password', 'password2')
    }
    );

  }
  //Validar los campos
  public get nombreInvalido(): boolean | undefined {
    return this.form.get('nombre')?.invalid && this.form.get('nombre')?.touched
  }
  public get apellidoInvalido(): boolean | undefined {
    return this.form.get('apellido')?.invalid && this.form.get('apellido')?.touched
  }
  public get celularInvalido(): boolean | undefined {
    return this.form.get('telefono')?.invalid && this.form.get('telefono')?.touched
  }
  public get usuarioInvalido(): boolean | undefined {
    return this.form.get('username')?.invalid && this.form.get('username')?.touched
  }
  public get emailInvalido(): boolean | undefined {
    return this.form.get('email')?.invalid && this.form.get('email')?.touched
  }
  public get passwordInvalido(): boolean | undefined {
    return this.form.get('password')?.invalid && this.form.get('password')?.touched
  }

  public get password2Invalido(): boolean | undefined {

    let pass1 = this.form.get("password").value;
    let pass2 = this.form.get("password2").value;

    return (pass1 === pass2) ? false : true;

  }

  //Obtener los roles y hablitar al cliente
  public listarRoles(): void {
    this.roleService.findAllRoles().subscribe(roles => {
      this.role_user = roles[1];   
      this.cliente.roles.push(this.role_user);
      this.cliente.habilitado = true;
    });
  }

  //Crear clientes
  public crearClientes(): void {

    if (this.form.invalid) {
      return Object.values(this.form.controls).forEach(contol => {
        contol.markAsTouched();
      }
      );

    } else {
       this.construirCliente();
       this.clienteService.saveCustomer(this.cliente).subscribe(
        () => {
        }, (err) => {
          this.errores = err.error.error_400 as Array<string>;
          if (err.status == 400) {
            Swal.fire(`Error: ${err.status}`, "Los campos con (*) son obligatorios", "error");
          }
          if (err.status == 500) {
            let error_duplicado: string = err.error.error_500.localizedMessage.split(" ")[2];
            Swal.fire(`Error: ${err.status}`, `El valor: ${error_duplicado} ya esta existe.`, "error");
          }
        }
      );

      Swal.fire("Registro", `Bienvenido ${this.cliente.username} te has registrado con éxito.`, 'success')
        .then(result => {
          if (result.isConfirmed) {
            this.authService.login(this.cliente).subscribe(jUsuario=>{
              this.authService.guardarUsuario(jUsuario.access_token);
               this.authService.guardarToken(jUsuario.access_token);
               history.back();
            });
          }
        });
    }
  }

  //Establecer al cliente
  private construirCliente():void{   
    this.cliente.nombre = this.form.get("nombre").value;
    this.cliente.apellido = this.form.get("apellido").value;
    this.cliente.email = this.form.get("email").value;
    this.cliente.username = this.form.get("username").value;
    this.cliente.telefono = this.form.get("telefono").value;
    this.cliente.password = this.form.get("password").value;   
  }
}
