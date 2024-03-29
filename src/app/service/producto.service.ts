import { EventEmitter, Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { Producto } from "../entity/producto";
import { HttpClient } from "@angular/common/http";
import { catchError, map} from "rxjs/operators";
import { Categoria } from "../entity/categoria";

@Injectable({
  providedIn: "root",
})

export class ProductoService {

  private urlEndPoint: string = "http://localhost:8080/api/productos";
  public productos: Array<Producto>;
  
  constructor(private http: HttpClient) {
    this.productos = new Array();
  }


  //Listar productos
  public puductList(page:number): Observable<any> {
    return this.http.get<any>(`${this.urlEndPoint}/page/`+page);
  }

  //Buscar producto por nombre
  public findProductoByNombre(nombre:string):Observable<Array<Producto>>{
    return this.http.get<Array<Producto>>(`${this.urlEndPoint}/buscar/nombre?nombre=${nombre}`);
  }

  //Buscar producto por datos
  public findProductosByDatos(datos:string):Observable<Array<Producto>>{
    return this.http.get<Array<Producto>>(`${this.urlEndPoint}/buscar/datos?datos=${datos}`);
  }

  //Buscar producto por categoria
  public findProductosByCategoria(id:string):Observable<Array<Producto>>{
    return this.http.get<Array<Producto>>(`${this.urlEndPoint}/buscar/categoria?id=${id}`);
  }

  //Buscar productos por oferta
  public findProductosByOferta(oferta:string):Observable<Array<Producto>>{
    return this.http.get<Array<Producto>>(`${this.urlEndPoint}/buscar/oferta?oferta=${oferta}`)
  }
  //Retorna el listado de categorias
  public categoriaList(): Observable<Array<Categoria>> {
    return this.http.get<Array<Categoria>>(`${this.urlEndPoint}/categorias`);
  }
  //Buscar un producto por su id
  public findProductById(id: string): Observable<Producto> {

    return (
      this.http
        .get<Producto>(`${this.urlEndPoint}/${id}`)
        //Manejar error 400
        .pipe(
          catchError((err) => {
            if (err.status == 404 && err.error.error_404) {
              return throwError(err);
            }
            return throwError(err);
          })
        )
    );
  }

  //Guardar productos
  public saveProduct(file: Array<File>, producto: any): Observable<Producto> {
    //Agregar todos los atributos del producto
    let formData = new FormData();
    //Agregar las imagenes
    formData.append("file", file[0]);
    formData.append("file", file[1]);
    formData.append("file", file[2]);
    formData.append("file", file[3]);
    formData.append("file", file[4]);
    //Agregar los datos del producto
    formData.append("nombre", producto.nombre);
    formData.append("precio", producto.precio);
    formData.append("precioOriginal", producto.precioOriginal);
    formData.append("descripcion", producto.descripcion);
    formData.append("caracteristicas", producto.caracteristicas);
    formData.append("stock", producto.stock);
    formData.append("oferta", producto.oferta);
    formData.append("categoria.id", producto.categoria.id);
    formData.append("categoria.nombre", producto.categoria.nombre);

    return (
      this.http
        .post<Producto>(`${this.urlEndPoint}/create`, formData)
        //Manejar errores 400 y 500

          .pipe(
            map((response: any) => response.producto as Producto),
            catchError((err) => {
              if (err.status == 400 && err.error.error_400) {
                return throwError(err);
              }
              if (err.status == 500 && err.error.error_500) {
                return throwError(err);
              }
              return throwError(err);
            })
          )
      );
  }

  //Actualizar producto
  public updateProduct(producto): Observable<any> {

    //Agregar todos los atributos del producto
    return this.http
      .put<any>(`${this.urlEndPoint}/update/${producto.id}`, producto)
      .pipe(
        catchError((err) => {
          if (err.status == 400 && err.error.error_400) {
            return throwError(err);
          } else if (err.staus == 404 && err.error.error_404) {
            return throwError(err);
          } else if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }
  //Actualizar la imagen
  public updateImg(file: File[], id: string): Observable<any> {

    let formData = new FormData();
    formData.append("file", file[0]);
    formData.append("id", id);

    return this.http
      .put<any>(`${this.urlEndPoint}/image/update`, formData)
      .pipe(
        catchError((err) => {
          if (err.status == 404 && err.error.error_404) {
            return throwError(err);
          } else if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }
  //Actualizar las imagenes
  public updateImgs(file: File[], id: string): Observable<any> {
    let formData = new FormData();
    formData.append("file", file[0]);
    formData.append("file", file[1]);
    formData.append("file", file[2]);
    formData.append("file", file[3]);
    formData.append("file", file[4]);
    formData.append("id", id);

    return this.http
      .put<any>(`${this.urlEndPoint}/image/update`, formData)
      .pipe(
        catchError((err) => {
          if (err.status == 404 && err.error.error_404) {
            return throwError(err);
          } else if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }

  //Eliminar la imagen
  public delateImg(id: string, img: string): Observable<any> {

    return this.http
      .put<any>(`${this.urlEndPoint}/image/delete/${id}/?img=${img}`, null)
      .pipe(
        catchError((err) => {
          if (err.status == 404 && err.error.error_404) {
            return throwError(err);
          } else if (err.status == 404 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );


  }

  //Eliminar producto
  public deleteProduct(id: string): Observable<Producto> {

    return this.http.delete<Producto>(`${this.urlEndPoint}/delete/${id}`).pipe(
      catchError((err) => {
        if (err.status == 404 && err.error.error_404) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }
}
