import { HttpClient, HttpEvent, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Categoria } from "../entity/categoria";
import { catchError, map, switchAll, tap } from "rxjs/operators";
import { Producto } from "../entity/producto";
import { EventEmitter } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CategoriaService {
  private urlEndPoint: string = "http://localhost:8080/api/productos";

  private _notificarUpload = new EventEmitter<any>();

  constructor(private http: HttpClient) {}

  //CRUD PARA CATEGORIAS

  //Guardar categorias
  public saveCategory(categoria: Categoria): Observable<Categoria> {
    return this.http
      .post<Categoria>(`${this.urlEndPoint}/categorias/create`, categoria)
      .pipe(catchError((err) => {
          if (err.status == 400 && err.error.error_400) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }

  //Editar categoria
  public editCategory(categoria: Categoria): Observable<Categoria> {
    return this.http
      .put<Categoria>(
        `${this.urlEndPoint}/categorias/update/${categoria.id}`,
        categoria
      )
      .pipe(
        catchError((err) => {
          if (err.status == 400 && err.error.error_400) {
            return throwError(err);
          } else if (err.status == 404 && err.error.error_404) {
            return throwError(err);
          } else if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
        })
      );
    /*const req = new HttpRequest("PUT",`${this.urlEndPoint}/categorias/update/${categoria.id}`,categoria);
      return this.http.request(req);*/
  }

  //Eliminar categoria
  public delateCategory(id: string): Observable<Categoria> {
    return this.http
      .delete<Categoria>(`${this.urlEndPoint}/categorias/delete/${id}`)
      .pipe(
        catchError((err) => {
          if (err.status == 404 && err.error.error_404) {
            return throwError(err);
          }
          if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }

  //Retornar el evento emitido.
  get notificarUpload(): EventEmitter<any> {
    return this._notificarUpload;
  }
}
