import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../entity/role';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

constructor(private http:HttpClient) { }


  private urlEndPoint:string = "http://localhost:8080/api/roles"

  public findAllRoles():Observable<Array<Role>>{
      return this.http.get<Array<Role>>(`${this.urlEndPoint}`);
  }

}
