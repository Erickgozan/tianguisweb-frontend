import { Pipe, PipeTransform } from '@angular/core';
import { Producto } from '../entity/producto';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(lista: Producto[], texto:string): Producto[] {
    
    if(!texto) return lista;

    return lista.filter(producto => producto.nombre.toUpperCase().includes(texto.toUpperCase()));

  }

}
