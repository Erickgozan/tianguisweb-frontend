import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Direccion } from "../entity/direccion";

@Injectable({
  providedIn: "root",
})
export class DireccionService {
  private urlEndPoint: string = "https://api-sepomex.hckdrk.mx/query/info_cp";

  constructor(private http: HttpClient) {}

  public obtenerDireciones(cp: number): Observable<any>{
    return this.http.get<any>(`${this.urlEndPoint}/${cp}`);
  }
}
