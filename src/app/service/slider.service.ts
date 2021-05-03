import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Slider } from '../entity/slider';

@Injectable({
  providedIn: 'root'
})
export class SliderService {

  private urlEndPoint = "http://localhost:8080/api/slider";

  constructor(private http: HttpClient) { }

  //Listar las imagenes del slider
  public listSlider(): Observable<Array<Slider>> {
    return this.http.get<Array<Slider>>(this.urlEndPoint);
  }

  //Crear las imagenes del slider
  public crateSlider(files: Array<File>): Observable<Slider> {

    let formData = new FormData();
    formData.append("files", files[0]);
    formData.append("files", files[1]);
    formData.append("files", files[2]);

    return this.http.post<Slider>(`${this.urlEndPoint}/create`, formData)
      .pipe(
        catchError((err) => {
          if (err.status == 500 && err.error.error_500) {
            return throwError(err);
          }
          return throwError(err);
        })
      );
  }

  //Buscar por su id
  public listSliderById(id: string): Observable<Slider> {
    return this.http.get<Slider>(`${this.urlEndPoint}/${id}`).pipe(
      catchError((err) => {
        if (err.status == 404 && err.error.error_404) {
          return throwError(err);
        }
        return throwError(err);
      })
    );
  }

  //Actualizar la imagen del slider
  public updateImgSlider(files:File,id:string):Observable<any>{
      const formData = new FormData();
      formData.append("files",files);
      formData.append("id",id);

      console.log("file: " + files.name + "id: " + id);
                
      return this.http.put<any>(`${this.urlEndPoint}/image/update`,formData)
      .pipe(
        catchError(err=>{
            if(err.status==404 && err.error.error_404){
                return throwError(err);
            }
            if(err.status==500 && err.error.error_500){
              return throwError(err);
          }
          return throwError(err);
        })
      );
  }

  //Eliminar la imagen del slider
  public delateImgSlider(id:string,img:string):Observable<any>{
      return this.http.put(`${this.urlEndPoint}/image/delete/${id}?img=${img}`,null).pipe(
        catchError(err=>{
          if(err.status==404 && err.error.error_404){
            return throwError(err);
          }
          if(err.status==500 && err.error.error_500){
            return throwError(err);
          }
          return throwError(err);
        })
      )
  }


}
