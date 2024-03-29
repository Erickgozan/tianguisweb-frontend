import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AuthService } from 'src/app/service/Auth.service';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

/*Clase interceptora que maneja los errores 401(Se requiere autenticacion)
y 403(Sin permisos)*/
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService,
        private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler):
        Observable<HttpEvent<any>> {

        return next.handle(req).pipe(
            catchError(e => {
                if (e.status == 401) {

                    if (this.authService.isAuthenticated()) {
                        this.authService.logout();
                    }
                    this.router.navigate(["/cliente/login"]);
                }
                if (e.status == 403) {
                    Swal.fire('Acceso denegado', `Hola ${this.authService.usuario.email} no tienes acceso a este recurso`, 'warning');
                    this.router.navigate(["/"]);
                }
                return throwError(e);
            })
        );
    }
}