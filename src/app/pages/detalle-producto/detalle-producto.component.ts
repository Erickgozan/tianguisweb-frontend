import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import { CompraService } from "src/app/service/compra.service";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-detalle-producto",
  templateUrl: "./detalle-producto.component.html",
  styleUrls: ["./detalle-producto.component.css"],

})
export class DetalleProductoComponent implements OnInit {

  public producto: Producto;
  public pedido: Pedido;
  public imagen: string;
  public total: number;
  public cantidad: number = 1;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    public carritoService: CarritoService,
    public compraService: CompraService
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
          .subscribe((producto) => {
            this.producto = producto
            this.total = this.producto.precio;
          });
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
  public generarPedido(producto: Producto): void {

    this.pedido.itemProductos = new Array();

    const productosItem = this.pedido.itemProductos.find(items => {
      return items.producto.id === producto.id;
    })

    if (productosItem != undefined) {
      productosItem.cantidad = this.cantidad;
    } else {
      const item: ItemProducto = {
        cantidad: this.cantidad,
        producto: producto
      };
      this.pedido.precioTotal = this.total;
      this.pedido.itemProductos.push(item);
    }

    Swal.fire({
      title: 'Confirmar la compra?',
      text: `${producto.nombre}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si lo quiero!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.compraService.generarCompra(this.pedido).subscribe();
        Swal.fire(
          `Ya es tuyo ${this.pedido.cliente.nombre}!`,
          'Hemos confirmado tu compra.',
          'success'
        );
        this.carritoService.eliminarItem(producto.id);
      }
    });
    console.log(this.pedido);

  }




  //Selecciona y muestra la imagen del producto.
  public seleccionarImg(img: string): void {
    this.imagen = img;
  }

}
