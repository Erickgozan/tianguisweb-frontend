import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from '../entity/cliente';
import { Role } from '../entity/role';
import { Usuario } from '../entity/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _usuario: Cliente;
  private _token: string;

  constructor(private http: HttpClient) { }

  //Metodo para iniciar sesión
  public login(usuario: Usuario): Observable<any> {

    const urlEndPoint = "http://localhost:8080/oauth/token";
    const credenciales = btoa('angularApp' + ':' + 'EA_gf_1240@');
    const httpHeaders = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + credenciales
    });
    let params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('username', usuario.username);
    params.set('password', usuario.password);
    //console.log("parametros: "+params);

    return this.http.post<any>(urlEndPoint, params.toString(), { headers: httpHeaders });
  }

  //Obtener el usuario desde el sessionStorage
  public get usuario(): Cliente {
    if (this._usuario != null) {
      return this._usuario;
    } else if (this._usuario == null && sessionStorage.getItem('usuario') != null) {
      this._usuario = JSON.parse(sessionStorage.getItem('usuario')) as Cliente;
      return this._usuario;
    }
    return new Cliente();
  }

  //Obtener el token desde el sessionStorage
  public get token(): string {
    if (this._token != null) {
      return this._token;
    } else if (this._token == null && sessionStorage.getItem('token') != null) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  //Metodo para obtener los datos del payload del usuario y almacenarlos en la clase Cliente
  public guardarUsuario(accessToken: string): void {
    let payload = this.obtenerDatosToken(accessToken);
    this._usuario = new Cliente();
    this._usuario.username = payload.user_name;
    this._usuario.email = payload.email;
    this._usuario.apellido = payload.apellido;
    this._usuario.rolesString = payload.authorities;
    this._usuario.id = payload.id;
    // console.log(this._usuario);

    sessionStorage.setItem('usuario', JSON.stringify(this._usuario));

  }

  public guardarToken(accessToken: string): void {
    this._token = accessToken;
    sessionStorage.setItem('token', accessToken);
  }

  //Metodo para obtener el payload(datos del usuario) del token
  public obtenerDatosToken(accessToken: string): any {
    if (accessToken != null) {
      return JSON.parse(atob(accessToken.split(".")[1]));
    }
    return null;
  }

  //Metodo  para comprobar si el usuario esta autenticado
  public isAuthenticated(): boolean {
    let payload = this.obtenerDatosToken(this.token);

    if (payload != null && payload.user_name && payload.user_name.length > 0) {
      return true;
    }
    return false;
  }

  //Metodo para saber que roles tiene el usuario
  public hasRole(role: string): boolean {

    if (this.usuario.rolesString.includes(role)) {
      return true
    }

    return false;

  }

  //Metodo para cerrar sesión
  public logout() {
    this._token = null;
    this._usuario = null;
    sessionStorage.clear();
  }

}
