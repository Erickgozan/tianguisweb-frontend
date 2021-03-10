import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Cliente } from "../entity/cliente";

@Injectable({
  providedIn: "root",
})
export class ClienteService {
  public urlEndPoint: string = "http://localhost:8080/api/clientes";
  public httpHeaders = new HttpHeaders({ "content-type": "application/json" });

  constructor(private http: HttpClient) {}

  //Retornar el listado de clientes
  public customerList(): Observable<Array<Cliente>> {
    return this.http.get<Array<Cliente>>(`${this.httpHeaders}`);
  }

  //Buscar cliente
  public findCustumerById(id:string):Observable<Cliente>{
    return this.http.get<Cliente>(`${this.httpHeaders}/${id}`).pipe(
      catchError((err) => {
        if (err.status == 400 && err.error.error_400) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }

  //Guardar a el cliente
  public saveCustomer(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.urlEndPoint}/create`, cliente).pipe(
      catchError((err) => {
        if (err.status == 400 && err.error.error_400) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }

  //Actualizar el cliente
  public updateCustomer(cliente: Cliente, id: string): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${id}`, cliente).pipe(
      catchError((err) => {
        if (err.status == 404 && err.error.error_404) {
          return throwError(err);
        }
        if (err.status == 400 && err.error.error_400) {
          return throwError(err);
        }
        if (err.status == 500 && err.error.error_500) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }


}
