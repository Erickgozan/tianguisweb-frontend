import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { Cliente } from "src/app/entity/cliente";
import { Direccion } from "src/app/entity/direccion";
import { Role } from "src/app/entity/role";
import { Usuario } from "src/app/entity/usuario";
import { AuthService } from "src/app/service/Auth.service";
import { ClienteService } from "src/app/service/cliente.service";
import { DireccionService } from "src/app/service/direccion.service";
import { RoleService } from "src/app/service/role.service";
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

  constructor(
    private clienteService: ClienteService,
    private roleService: RoleService,
  ) {
    this.cliente = new Cliente();
    this.role_user = new Role();
    this.cliente.roles = new Array();
  }

  ngOnInit(): void {
    this.listarRoles();
  }

  //Obtener los roles
  public listarRoles(): void {
    this.roleService.findAllRoles().subscribe(roles => {
      this.role_user = roles[1];
      this.cliente.roles.push(this.role_user);
      this.cliente.habilitado = true;
    });
  }
 

  //Crear clientes
  public crearClientes(): void {

    this.clienteService.saveCustomer(this.cliente).subscribe(
      () => {  
        //console.log(this.cliente);
           
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

    Swal.fire("Registro", `Bienvenido ${this.cliente.username} te has registrado con éxito, ahora puedes inicar sesión`, 'success')
    .then(result => {
      if (result.isConfirmed) {
        location.reload();
      }
    });

  }
}
