import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { TokenDto } from "src/app/entity/token-dto";
import { Usuario } from "src/app/entity/usuario";
import { AuthSocialService } from "src/app/service/auth-social.service";
import { AuthService } from "src/app/service/Auth.service";
import { TokenSocialService } from "src/app/service/token-social.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {

  public formRegistro = false;
  public formPassword = false;

  public socialUser: SocialUser;
  public userLogged: SocialUser;
  public isLogged: boolean;

  public usuario: Usuario;

  constructor(private authService: AuthService,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private oauthService: AuthSocialService,
    private tokenService: TokenSocialService) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      Swal.fire("Login", `${this.authService.usuario.username} ya estás autenticado!`, 'info');
      this.router.navigate(["/"]);
    }
    this.socialAuthService.authState.subscribe(
      data => {
        this.userLogged = data;
        this.isLogged = (this.userLogged != null && this.tokenService.getToken != null);
      }
    );
  }

  public signInWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then
      (data => {
        this.socialUser = data;
        console.log(this.socialUser.idToken);
        const tokenGoogle = new TokenDto(this.socialUser.idToken);
        this.oauthService.google(tokenGoogle).subscribe(
          res => {
            this.tokenService.setToken(res.value);
            this.isLogged = true;
            this.router.navigate(["/"]);
          },
          err => {
            console.log(err);
            this.logout();
          }
        )
      }).catch(
        err => {
          console.log(err);

        }
      );
  }

  public signInWithFB(): void {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID).then
      (data => {
        this.socialUser = data;
        const tokenFace = new TokenDto(this.socialUser.authToken);
        this.oauthService.facebook(tokenFace).subscribe(
          res => {
            this.tokenService.setToken(res.value);
            this.isLogged = true;
            this.router.navigate(["/"]);
          },
          err=>{
            console.log(err);
            this.logout();
            
          }
        );
      }).catch(
        err=>{
          console.log(err);        
        }
      );
  }

  public login(): void {

    if (this.usuario.username == null || this.usuario.password == null) {
      Swal.fire("Error login", "Usuario o password vacías!", "error");
      return;
    }

    this.authService.login(this.usuario).subscribe(jsonUsuario => {

      this.authService.guardarUsuario(jsonUsuario.access_token);
      this.authService.guardarToken(jsonUsuario.access_token);

      this.router.navigate(["/"]);
      Swal.fire("Login", `Bienvenido ${this.usuario.username} has iniciado sesion con éxito`, 'success')
    }, err => {
      if (err.status == 400) {
        Swal.fire("Error login", "Usuario o password incorrectos!", "error");
      }
    });

  }

  public logout(): void {
    this.socialAuthService.signOut().then(data => {
      this.tokenService.logOut();
      this.isLogged = false;
    })
  }
}
