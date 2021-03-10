import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
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
  public apiDirecciones: any;
  public direccion: Direccion;
  public errores:Array<string>;

  constructor(
    private clienteService: ClienteService,
    private direccionService: DireccionService,
    private router:Router
  ) {
    this.cliente = new Cliente();
    this.direccion = new Direccion();
  }

  ngOnInit(): void {}

  //Obtener direcciones
  public listarDirecciones(cp: number): void {
    this.direccionService.obtenerDireciones(cp).subscribe(
      (jsonDirecciones) => {
        this.apiDirecciones = jsonDirecciones;
        this.direccion.cp = jsonDirecciones[0].response.cp;
        this.direccion.municipio = jsonDirecciones[0].response.municipio;
        this.direccion.estado = jsonDirecciones[0].response.estado;
        this.cliente.direccion = this.direccion;     
      },
      (err: any) => {
        Swal.fire("Upps!", `${err.error.error_message}`, "error");
        this.cliente.direccion.municipio = "";
        this.cliente.direccion.estado = "";
        this.apiDirecciones = null;
      }
    );
  }

  //Crear clientes
  public crearClientes(): void {
    this.clienteService.saveCustomer(this.cliente).subscribe(
      (jsonCliente) => {
        this.cliente = jsonCliente;
        Swal.fire(
          "Genial!!",
          `${jsonCliente.mensaje}`,
          "success"
        ).then(result =>{
          if(result.isConfirmed){
              this.cliente = new Cliente();
              this.direccion = new Direccion();
              this.apiDirecciones = null;
          }
        });
        this.router.navigate(["/"]);
      },
      (err) => {
        this.errores = err.error.error_400 as Array<string>;
        if(err.status== 400){
          Swal.fire(`Error: ${err.status}` , "Los campos con (*) son obligatorios", "error");
          console.log(err);
          
        }
        if (err.status == 500) {
          Swal.fire(`Error: ${err.status}`, `Error: ${err.error.message}`, "error");
          console.log(err);
        }
      }
    );
  }
}
