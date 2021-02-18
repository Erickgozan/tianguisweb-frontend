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
  public direcciones: any;
  public direccion: Direccion;

  constructor(
    private clienteService: ClienteService,
    private direccionService: DireccionService
  ) {
    this.cliente = new Cliente();
    this.direccion = new Direccion();
  }

  ngOnInit(): void {}

  //Obtener direcciones
  public listarDirecciones(cp: number): void {
    this.direccionService.obtenerDireciones(cp).subscribe(
      (direcciones) => {
        //this.direcciones = direcciones;
        this.cliente.direccion = direcciones;
        this.cliente.direccion.cp = direcciones[0].response.cp;
        this.cliente.direccion.municipio = direcciones[0].response.municipio;
        this.cliente.direccion.estado = direcciones[0].response.estado;      
        
        console.log( this.cliente.direccion.estado);
      },
      (err) => {
        Swal.fire("Upps!", `${err.error.error_message}`, "error");
        this.cliente.direccion.municipio = "";
        this.cliente.direccion.estado = "";
        this.direcciones = null;
      }
    );
  }

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
