import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import { ProductoService } from "src/app/service/producto.service";
@Component({
  selector: "app-detalle-producto",
  templateUrl: "./detalle-producto.component.html",
})
export class DetalleProductoComponent implements OnInit {
  
  public producto: Producto;
  public pedido: Pedido;
  public imagen: string;
  public total: number;
  public cantidad:number=1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    public carritoService: CarritoService
  ) {
    this.producto = new Producto();
    this.pedido = this.carritoService.getPedido();
  }

  ngOnInit(): void {
    this.cargarProducto();
    }

  //Muestra el producto que en base a su id
  public cargarProducto(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params.id;
      if (id != null) {
        this.productoService
          .findProductById(id)
          .subscribe((producto) => (this.producto = producto));
      }
    });
  }

  //Actualizar la cantidad del producto
  public actualizarCantidad(event: any): void {
    let cantidad = event.target.value as number;
    this.total = this.producto.precio * cantidad;
    this.cantidad = cantidad;
  }

  //Genera el pedido
  public generarPedido(producto:Producto): void {   
    this.carritoService.addProdcutoDetalle(producto,this.cantidad);
  }

  //Selecciona y muestra la imagen del producto.
  public seleccionarImg(img: string): void {
    this.imagen = img;
  }

  /**
   * 
let itemProducto = this.pedido.productos.find((item) => {
      return item.producto.id === producto.id;
    });

    if (itemProducto == undefined) {
      this.carritoService.addProductoPedido(producto);
    } else {
      this.carritoService.addProductoPedidoChange(producto, event);
    }
    console.log(this.itemProducto);
   */
}
