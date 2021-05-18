import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Producto } from './entity/producto';
import { ProductoService } from './service/producto.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent{
  
  public filtro_valor: string = "";

  constructor(private router: Router) { }

  //Metodo que recupera el texto del input
  handleSearch(value: string): void {
    this.filtro_valor = value;
    if (this.filtro_valor) {
      this.router.navigate(['productos/buscar/', this.filtro_valor]);
    }
  }

}
