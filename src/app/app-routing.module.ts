import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { Error404Component } from './error404/error404.component';


const routes: Routes = [
  //Ruta principal
 // {path:'', redirectTo:'header', pathMatch:'full'},
  //ruta encabezado
  {path:'header', component:HeaderComponent},
  //Ruta pie de pagina
  {path:'footer',component:FooterComponent},
  //Ruta error 404
  {path:'404',component:Error404Component},
  {path:'*', redirectTo:"/404"}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
