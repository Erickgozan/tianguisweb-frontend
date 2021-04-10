//Modulos
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Componentes
import { AppComponent } from './app.component';
import { FooterComponent } from './pages/footer/footer.component';
import { Error404Component } from './pages/error404/error404.component';
import { MenuComponent } from './pages/menu/menu.component';
import { ListaProductosComponent } from './pages/lista-productos/lista-productos.component';
import { SliderComponent } from './pages/slider/slider.component';
import { ProductoComponent } from './pages/form-producto/producto.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoProductoComponent } from './pages/carrito-producto/carrito-producto.component';
import { TarjetaProductoComponent } from './pages/tarjeta-producto/tarjeta-producto.component';
import { ClienteComponent } from './pages/form-cliente/cliente.component';
import { LoginComponent } from './pages/login/login.component';
import { FormDireccionComponent } from './pages/form-direccion/form-direccion.component';
//Interceptores
import { TokenInterceptor } from './entity/interceptors/token.interceptor';
import { AuthInterceptor } from './entity/interceptors/auth.interceptor';

//Social login
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';


@NgModule({
  declarations: [
    AppComponent,
    SliderComponent,
    FooterComponent,
    Error404Component,
    ProductoComponent,
    MenuComponent,
    ListaProductosComponent,
    CategoriaComponent,
    DetalleProductoComponent,
    CarritoProductoComponent,
    TarjetaProductoComponent,
    ClienteComponent,
    LoginComponent,
    FormDireccionComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SocialLoginModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  //Social
  {
    provide: 'SocialAuthServiceConfig',
    useValue: {
      autoLogin: false,
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(
            '366236921494-l9lat44ktmk287utr3gj8hs8nbdail7m.apps.googleusercontent.com'
          )
        },
        {
          id: FacebookLoginProvider.PROVIDER_ID,
          provider: new FacebookLoginProvider('3743722089058250')
        }
      ]
    } as SocialAuthServiceConfig,
  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
