import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public filtro_valor: string = "";

  constructor(private router: Router) { }

  //Metodo que recupera el texto del input
  handleSearch(value: string): void {
    this.filtro_valor = value;
    if (this.filtro_valor) {
      this.router.navigate(['productos/buscar/', this.filtro_valor]);
    }
  }

  handleSearchCategorie(value: string) {
    this.router.navigate(['productos/buscar/categoria/', value]);
  }

  handledSerachOferta(value: boolean) {
    this.router.navigate(['productos/buscar/oferta/', value]);
  }

}
