import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './pages/footer/footer.component';
import { Error404Component } from './pages/error404/error404.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './pages/menu/menu.component';
import { ListaProductosComponent } from './pages/lista-productos/lista-productos.component';
import { SliderComponent } from './pages/slider/slider.component';
import { ProductoComponent } from './pages/form-producto/producto.component';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { DetalleProductoComponent } from './pages/detalle-producto/detalle-producto.component';
import { CarritoProductoComponent } from './pages/carrito-producto/carrito-producto.component';
import { TarjetaProductoComponent } from './pages/tarjeta-producto/tarjeta-producto.component';
import { ClienteComponent } from './pages/form-cliente/cliente.component';
import { LoginComponent } from './pages/login/login.component';
import { DireccionClienteComponent } from './pages/direccion-cliente/direccion-cliente.component';

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
    DireccionClienteComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
