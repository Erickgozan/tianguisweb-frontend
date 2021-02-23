import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Direccion } from "../entity/direccion";

@Injectable({
  providedIn: "root",
})
export class DireccionService {
  private urlEndPointApiDireccion: string =
    "https://api-sepomex.hckdrk.mx/query/info_cp";
  private urlEndPoint: string = "http://localhost:8080/api/direcciones";

  constructor(private http: HttpClient) {}

  //Obtener la dirección del api externa
  public getAddress(cp: number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPointApiDireccion}/${cp}`);
  }

  //Obtener la direccion de la urlEndPoint
  public getAddressById(id:number):Observable<Direccion>{
     return this.http.get<Direccion>(`${this.urlEndPoint}/${id}`).pipe(
       catchError((err)=>{
          if(err.status==404 && err.error.error_404){
            return throwError(err);
          }
          return throwError(err);
       })
     )
  }

  public saveAddress(direccion: Direccion): Observable<Direccion> {
    return this.http
      .post<Direccion>(`${this.urlEndPoint}/save`, direccion)
      .pipe(
        catchError((err) => {
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
