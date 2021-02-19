import { Component, OnInit } from "@angular/core";
import { Route, Router } from "@angular/router";
import { Direccion } from "src/app/entity/direccion";
import { DireccionService } from "src/app/service/direccion.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-direccion-cliente",
  templateUrl: "./direccion-cliente.component.html",
  styleUrls: ["./direccion-cliente.component.css"],
})
export class DireccionClienteComponent implements OnInit {
  public direccion: Direccion;
  public apiDirecciones: any;
  public errores: Array<string>;

  constructor(private route:Router,private direccionService: DireccionService) {
    this.direccion = new Direccion();
  }

  ngOnInit(): void {}

  //Obtener direcciones
  public listarDirecciones(cp: number): void {
    this.direccionService.getAddress(cp).subscribe(
      (direcciones) => {
        //this.direcciones = direcciones;
        this.apiDirecciones = direcciones;
        this.direccion.cp = direcciones[0].response.cp;
        this.direccion.municipio = direcciones[0].response.municipio;
        this.direccion.estado = direcciones[0].response.estado;
      },
      (err) => {
        Swal.fire("Upps!", `${err.error.error_message}`, "error");
        this.direccion.municipio = "";
        this.direccion.estado = "";
        this.apiDirecciones = null;
      }
    );
  }

  public crearDireccion(): void {
    this.direccionService.saveAddress(this.direccion).subscribe(
      (jsonDireccion) => {
        Swal.fire({
          icon: "success",
          title: "Genial!",
          text: `${jsonDireccion.mensaje}`,
        }).then(result=>{
          if(result.isConfirmed){
            this.route.navigate(["/cliente/form"])
          }
        });
      },
      (err) => {
        if (err.status == 400) {
          this.errores = err.error.error_400 as Array<string>;
          Swal.fire({
            icon: "error",
            title: `Error: ${err.status}`,
            text: "Todos los campos con * deben de estar llenos",
          });
        }
      }
    );
  }
}
