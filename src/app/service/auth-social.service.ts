import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenDto } from '../entity/token-dto';

const headers = {headers: new HttpHeaders({"Content-type":"application/json"})}

@Injectable({
  providedIn: 'root'
})
export class AuthSocialService {

  private urlEndPoint = "http://localhost:8080/oauth"

  constructor(private http:HttpClient) { }


  public google(tokenDto:TokenDto):Observable<TokenDto>{
    return this.http.post<TokenDto>(`${this.urlEndPoint}/google`,tokenDto,headers);
  }

  public facebook(tokenDto:TokenDto):Observable<TokenDto>{
    return this.http.post<TokenDto>(`${this.urlEndPoint}/google`,tokenDto,headers);
  }
}
