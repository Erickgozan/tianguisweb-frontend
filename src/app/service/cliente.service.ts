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

  //Guardar a el cliente
  public saveCustomer(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.urlEndPoint}/create`, cliente).pipe(
      catchError((err) => {
        if (err.status == 400 && err.error_400) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }

  //Actualizar el cliente
  public updateCustomer(cliente: Cliente, id: number): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.urlEndPoint}/${id}`, cliente).pipe(
      catchError((err) => {
        if (err.status == 404 && err.error_404) {
          return throwError(err);
        }
        if (err.status == 400 && err.error_400) {
          return throwError(err);
        }
        if (err.status == 500 && err.error_500) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }
}