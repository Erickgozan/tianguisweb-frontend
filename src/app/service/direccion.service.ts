import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DireccionService {

  private urlEndPointCors: string = "/query/info_cp";
  private urlEndPoint:string = "https://api-sepomex.hckdrk.mx/query/info_cp";

  constructor(private http: HttpClient) {}

  public obtenerDireciones(cp: number): Observable<any>{
    const token:string = "c24f5f55-9d14-48b5-883f-36426c9fa996"
    return this.http.get<any>(`${this.urlEndPointCors}/${cp}?token=${token}`);
  }
}
