import { HttpClient } from "@angular/common/http";
import { Injectable, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { EstadoPedido } from "../entity/estadoPedido.enum";
import { ItemProducto } from "../entity/itemProducto";
import { Pedido } from "../entity/pedido";
import { Producto } from "../entity/producto";
import { AuthService } from "./Auth.service";
import { ProductoService } from "./producto.service";

@Injectable({
  providedIn: "root",
})
export class CarritoService {
  private pedido: Pedido;
  private producto: Producto;

  constructor(private productoService: ProductoService,
    private authService:AuthService) {
    this.pedido = new Pedido();
    this.producto = new Producto();
    this.initCarrito();
  }

  //Inicializar los valores del pedido
  private initCarrito(): void {
    this.pedido.id = "";
    this.pedido.cliente = null;
    this.pedido.itemProductos = new Array();
    this.pedido.precioTotal = null;
    this.pedido.estado = EstadoPedido.VISTO;
    this.pedido.createAt = new Date();

    this.cargarStorage();
  }

  //Crear un metodo getter para obtener el precio original desde la base de datos
  

  //Agregar producto en el pedido y en el localStorage
  public addProductoPedido(producto: Producto) {
    
    this.producto = producto;

    let item = this.pedido.itemProductos.find((productos) => {
      return productos.producto.id === producto.id;
    });

    if (item !== undefined) {
      item.cantidad++;
      item.producto.precio = (this.producto.precio * item.cantidad);
      
    } else {
      const addProductoCarrito: ItemProducto = {
        cantidad: 1,
        producto,
      };
      this.pedido.itemProductos.push(addProductoCarrito);
    }

    this.pedido.cliente = this.authService.usuario;
    //Sumar el gran total
    this.sumarPrecioTotal();

    localStorage.setItem("pedido", JSON.stringify(this.pedido));
  }

  //Incrementar la cantidad del producto o eliminarlo desde el carrito de compras
  public addProductoPedidoChange(producto: Producto, event: any) {
    let cantidad = event.target.value as number;
   
    //Eliminar si la cantidad de productos es igual a 0
    if (cantidad == 0) {
      this.eliminarItem(producto.id);
    }

    //Incrementa o disminuye la cantidad de preductos del itemProducto
    //Y modifica el precio del producto
    this.pedido.itemProductos = this.pedido.itemProductos.map((item) => {
      if (producto.id === item.producto.id) {
        item.cantidad = cantidad;
        //Multiplicar el precio original por la cantidad de productos
        this.productoService.findProductById(producto.id).subscribe((jsonProducto) => {
          this.producto = jsonProducto;
          item.producto.precio = this.producto.precio * item.cantidad;
          
          //Sumar total
          this.sumarPrecioTotal()

          //Agregar el pedido al local storage
          localStorage.setItem("pedido", JSON.stringify(this.pedido));
        });

      }
      return item;
    });
    this.pedido.cliente = this.authService.usuario;
  }

  //Agregar el pedido desde el detalle del producto
  public addProductoDetalle(producto: Producto, cantidad: number, total:number): void {

    this.pedido.itemProductos = new Array();
    const productosItem = this.pedido.itemProductos.find(items => {
      return items.producto.id === producto.id;
    });

    if (productosItem != undefined) {
      productosItem.cantidad = cantidad;
    } else {
      const item: ItemProducto = {
        cantidad: cantidad,
        producto: producto
      };
      this.pedido.precioTotal = total;
      this.pedido.itemProductos.push(item);
    }
    this.pedido.cliente = this.authService.usuario;
    localStorage.setItem("pedido", JSON.stringify(this.pedido));
  }

  //Eliminar itemProducto
  public eliminarItem(id: string): void {
    this.pedido.itemProductos = this.pedido.itemProductos.filter(
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
    this.pedido.itemProductos.forEach((itemProducto) => {
      contarElementos += Number(itemProducto.cantidad);
    });
    return contarElementos;
  }

  //Obtener el precio total del pedio
  public sumarPrecioTotal(): void {
    let total: number = 0;
    this.pedido.itemProductos.forEach((itemPreudctos) => {
      total += Number(itemPreudctos.producto.precio);
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
