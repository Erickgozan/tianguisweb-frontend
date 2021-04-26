import { Component, Input, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/entity/cliente';
import { Direccion } from 'src/app/entity/direccion';
import { AuthService } from 'src/app/service/Auth.service';
import { ClienteService } from 'src/app/service/cliente.service';
import { DireccionService } from 'src/app/service/direccion.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-direccion',
  templateUrl: './form-direccion.component.html',
  styleUrls: ['./form-direccion.component.css']
})
export class FormDireccionComponent implements OnInit {

  public direccion: Direccion;
  public apiDirecciones: any;
  @Input()
  public cliente: Cliente;

  constructor(private direccionService: DireccionService,
    private clienteService: ClienteService,
    private activateRoute: ActivatedRoute,
    private authService: AuthService) {

    this.direccion = new Direccion();
    this.cliente = new Cliente();
  }

  ngOnInit(): void {
  }


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

  public guardarDireccion(f: NgForm): void {

    if (f.invalid) {
      return Object.values(f.controls).forEach(control => {
        control.markAsTouched();
      })
    } else {

      this.clienteService.updateCustomer(this.cliente, this.cliente.id).subscribe((jsonCliente) => {
        Swal.fire(
          "Agregado",
          `Se agrego tu dirección con éxito ${this.authService.usuario.nombre}!`,
          "success"
        ).then(result => {
          if (result.isConfirmed) {
            //history.back();
            location.reload()
          }
        });
      }, (err) => {
        if (err.status == 500) {
          Swal.fire("Error!", `${err.error.error_500}, los campos con (*) son requeridos.`, "error");
        }
      }
      );

    }
  }
  //Establecer la direccion como nula cuando se cierre el formulario
  public close():void{
    this.cliente.direccion=null;  
  }

}
