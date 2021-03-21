import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Cliente } from '../entity/cliente';
import { Pedido } from '../entity/pedido';
import { ClienteService } from './cliente.service';

@Injectable({
  providedIn: 'root'
})
export class CompraService {

  public urlEndPoint = "http://localhost:8080/api/pedidos"
 

constructor(private http:HttpClient, 
            private clienteService:ClienteService) { }



public generarCompra(pedido:Pedido):Observable<Pedido>{
  return this.http.post<Pedido>(`${this.urlEndPoint}/create`,pedido).pipe(
    catchError( (err)=>{
        if(err.ststus == 400){
          return throwError(err);
        }
        if(err.status == 500 && err.error.error_500){
          return throwError(err);
        }
          return throwError(err);
    })
  );
}

}
