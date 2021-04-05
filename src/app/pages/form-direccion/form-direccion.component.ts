import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/entity/cliente';
import { Direccion } from 'src/app/entity/direccion';
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
  public cliente: Cliente;

  constructor(private direccionService: DireccionService,
    private clienteService: ClienteService,
    private activateRoute:ActivatedRoute) {

    this.direccion = new Direccion();
    this.cliente = new Cliente();
  }

  ngOnInit(): void {
    this.obtenerCliente();
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

  public obtenerCliente(){
    this.activateRoute.params.subscribe((params)=>{
      let id = params.id;
      if(id!=null){
        this.clienteService.findCustumerById(id).subscribe((jsoncliente)=>{
          this.cliente = jsoncliente;
        })
      }
    })
  }

  public guardarDireccion(): void {

    this.clienteService.updateCustomer(this.cliente,this.cliente.id).subscribe((jsonCliente)=>
      {
        Swal.fire(
          "Agregado",
          `Se agrego tu dirección con éxito ${jsonCliente.nombre} !`,
          "success"
        ).then(result=>{
          if(result.isConfirmed){
            window.history.back();
          }
        });
      },(err)=>{
        if(err.status==500){
          Swal.fire("Error!",`${err.error.error_500}, los campos con (*) son requeridos.`,"error");
        }
      }
    );
    //console.log(this.cliente);
    

  }
}
