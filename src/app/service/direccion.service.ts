import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Direccion } from "../entity/direccion";

@Injectable({
  providedIn: "root",
})
export class DireccionService {
  
  private urlEndPointApiDireccion: string = "https://api-sepomex.hckdrk.mx/query/info_cp";
  private urlEndPoint:string = "http://localhost:8080/api/direcciones"

  constructor(private http: HttpClient) {}

  public getAddress(cp: number): Observable<any>{
    return this.http.get<any>(`${this.urlEndPointApiDireccion}/${cp}`);
  }

  public saveAddress(direccion:Direccion):Observable<Direccion>{
      return this.http.post<Direccion>(`${this.urlEndPoint}/save`,direccion).pipe(
          catchError((err)=>{
              if(err.status == 400 && err.error_400){
                return throwError(err);
              }
              if(err.status == 500 && err.error_500){
                return throwError(err);
              }
              return throwError(err);
          })
        )
  }
}
