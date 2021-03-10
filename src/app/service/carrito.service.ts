import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ItemProducto } from "../entity/itemProducto";
import { Pedido } from "../entity/pedido";
import { Producto } from "../entity/producto";
import { ProductoService } from "./producto.service";

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  private pedido: Pedido;
  private producto: Producto;

  constructor(private productoService: ProductoService) {
    this.pedido = new Pedido();
    this.producto = new Producto();
    this.initCarrito();
  }

  //Inicializar los valores del pedido
  private initCarrito(): void {
    this.pedido.id="";
    this.pedido.cliente = null;
    this.pedido.productos = new Array();
    this.pedido.precioTotal = null;
    this.pedido.estado = "VISTO";
    this.pedido.createAt = new Date();

    this.cargarStorage();
  }

  //Agregar producto en el pedido y en el localStorage
  public addProductoPedido(producto: Producto) {
    this.producto = producto;

    let item = this.pedido.productos.find((productos) => {
      return productos.producto.id === producto.id;
    });

    if (item !== undefined) {
      item.cantidad++;
      item.producto.precio *= item.cantidad;
    } else {
      const addProductoCarrito: ItemProducto = {
        cantidad: 1,
        producto,
      };
      this.pedido.productos.push(addProductoCarrito);
    }

    localStorage.setItem("pedido", JSON.stringify(this.pedido));

    this.contarElemtosCarrito();
    this.sumarPrecioTotal();
  }

  //Incrementar la cantidad del producto o eliminarlo desde el carrito de compras
  public addProductoPedidoChange(producto: Producto, event: any) {
    let cantidad = event.target.value as number;

    //Obtener el producto original de la base de datos
    this.productoService.findProductById(producto.id).subscribe((producto) => {
      this.producto = producto;
    });

    //Eliminar si la cantidad de productos es igual a 0
    if (cantidad == 0) {
      this.eliminarItem(producto.id);
    }
    
    //Incrementa o disminuye la cantidad de preductos del itemProducto
    //Y modifica el precio del producto
    this.pedido.productos = this.pedido.productos.map((item) => {
      if (producto.id === item.producto.id) {
        item.cantidad = cantidad;
        //Multiplicar el precio original por la cantidad de productos
        item.producto.precio = this.producto.precio * cantidad;
      }
      return item;
    });
        
    this.sumarPrecioTotal();
    localStorage.setItem("pedido", JSON.stringify(this.pedido));
  }

  //Agregar el pedido desde el detalle del producto
  public addProdcutoDetalle(producto:Producto, cantidad:number):void{

    const itemProducto = new ItemProducto();
    itemProducto.cantidad = cantidad;
    itemProducto.producto = producto;

    this.pedido.productos.push(itemProducto);

    localStorage.setItem("pedido",JSON.stringify(this.pedido));
  }

  //Eliminar itemProducto
  public eliminarItem(id: string): void {
    this.pedido.productos = this.pedido.productos.filter(
      (item) => id !== item.producto.id
    );
    this.sumarPrecioTotal();
    localStorage.setItem("pedido", JSON.stringify(this.pedido));
  }

  //Obtener el pedido
  public getPedido(): Pedido {
    return this.pedido;
  }

  //Contar todos los productos que se vayan agregando al carrito
  public contarElemtosCarrito(): number {
    let contarElementos: number = 0;
    this.pedido.productos.forEach((itemProducto) => {
      contarElementos += Number(itemProducto.cantidad);
    });
    return contarElementos;
  }

  //Obtener el precio total del pedio
  public sumarPrecioTotal(): void {
    let total: number = 0;
    this.pedido.productos.forEach((itemPreudctos) => {
      total += Number(itemPreudctos.producto.precio);
      //console.log(itemPreudctos.producto.precio);
    });
    this.pedido.precioTotal = total;
  }

  //Mantiene el producto en el localStorage
  private cargarStorage(): Pedido {
    if (localStorage.getItem("pedido")) {
      this.pedido = JSON.parse(localStorage.getItem("pedido"));
    }
    return this.pedido;
  }
}
