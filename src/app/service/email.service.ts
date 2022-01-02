import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Email } from '../entity/email';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

    private urlEndPoint= "http://localhost:8080/api/send-mail"

  constructor(private url:HttpClient) { }

  public sendImail(email:Email):Observable<any>{
        return this.url.post(`${this.urlEndPoint}`,email).pipe(
          catchError(err=>{
              return err;
          })
        );
  }
}
