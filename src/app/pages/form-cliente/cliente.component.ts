import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Cliente } from "src/app/entity/cliente";
import { Direccion } from "src/app/entity/direccion";
import { ClienteService } from "src/app/service/cliente.service";
import { DireccionService } from "src/app/service/direccion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-cliente",
  templateUrl: "./cliente.component.html",
  styleUrls: ["./cliente.component.css"],
})
export class ClienteComponent implements OnInit {
  public cliente: Cliente;

  constructor(private clienteService: ClienteService) {
    this.cliente = new Cliente();
  }

  ngOnInit(): void {}

  //Crear clientes
  public crearClientes(): void {
    this.clienteService.saveCustomer(this.cliente).subscribe(
      (cliente) => {
        this.cliente = cliente;
        Swal.fire(
          "Genial!!",
          `Bienvenido(a) ${cliente.nombre} ${cliente.apellidoPaterno} ${cliente.apellidoMaterno}`,
          "success"
        );
      },
      (err) => {
        // this.errores = err.error.error_400 as Array<string>;
        if (err.status == 500) {
          Swal.fire("Error!", `Error: ${err.error.message}`, "error");
        }
      }
    );
  }
}
