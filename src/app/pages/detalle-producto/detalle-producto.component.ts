import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Producto } from 'src/app/entity/producto';
import { ProductoService } from "src/app/service/producto.service";
@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.component.html',
})
export class DetalleProductoComponent implements OnInit {

  public producto:Producto;
  public imagen:string;

  constructor(private activatedRoute:ActivatedRoute, private productoService:ProductoService) { }

  ngOnInit(): void {
    this.cargarProducto();
  }

  //Muestra el producto que en base a su id
  public cargarProducto(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params.id;
      if (id != null) {
        this.productoService.findProductById(id).subscribe((producto) => (this.producto = producto));
      }
    });
  }
  //Selecciona y muestra la imagen del producto.
  public seleccionarImg(img:string):void{   
    this.imagen = img;
  }

}
