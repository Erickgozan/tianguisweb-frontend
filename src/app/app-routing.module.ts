import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { FooterComponent } from "./pages/footer/footer.component";
import { Error404Component } from "./pages/error404/error404.component";
import { ListaProductosComponent } from "./pages/lista-productos/lista-productos.component";
import { ProductoComponent } from "./pages/form-producto/producto.component";
import { CategoriaComponent } from "./pages/categoria/categoria.component";
import { DetalleProductoComponent } from "./pages/detalle-producto/detalle-producto.component";
import { CarritoProductoComponent } from "./pages/carrito-producto/carrito-producto.component";
import { ClienteComponent } from "./pages/form-cliente/cliente.component";
import { LoginComponent } from "./pages/login/login.component";

const routes: Routes = [ 
  //Ruta principal
  //{path:'', redirectTo:'lista-productos', pathMatch:'full'},
  { path: "", component: ListaProductosComponent },
  //ruta encabezado
  {
    path: "productos/form",
    component: ProductoComponent,
    children: [
      {
        //Ruta para categorias
        path: "categorias",
        component: CategoriaComponent,
      },
    ],
  },
  //Ruta para edita
  { path: "productos/form/:id", component: ProductoComponent },
  //Ruta para ver detalles
  { path: "productos/detalles/:id", component: DetalleProductoComponent },
  //Ruta para el carrito de compras
  { path: "productos/carrito", component: CarritoProductoComponent },
  //Ruta para el formulario del cliente
  { path: "cliente/form", component: ClienteComponent },
  //Ruta para el login
  { path: "cliente/login", component: LoginComponent },
  //Ruta pie de pagina
  { path: "footer", component: FooterComponent },
  //Ruta error 404
  { path: "404", component: Error404Component },
  //Ruta altenativa al error 404
  { path: "*", redirectTo: "/404" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
