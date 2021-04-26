import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import { ItemProducto } from "../entity/itemProducto";
import { Pedido } from "../entity/pedido";
import { Producto } from "../entity/producto";
import { AuthService } from "./Auth.service";
import { CompraService } from "./compra.service";
import { ProductoService } from "./producto.service";

@Injectable({
  providedIn: "root",
})
export class CarritoService {

  private pedido: Pedido;
  private _sinStock:boolean=false;

  constructor(private authService: AuthService,
    private compraService: CompraService,
    private productoService: ProductoService) {

    this.pedido = new Pedido();
    this.initCarrito();
  }

  //Inicializar los valores del pedido
  private initCarrito(): void {
    this.pedido.id = "";
    this.pedido.cliente = null;
    this.pedido.itemProductos = new Array();
    this.pedido.precioTotal = null;
    this.pedido.estado = "VISTO";
    this.pedido.createAt = new Date();

    this.cargarStorage();
  }

  //Establecer el pedido para persistir en la base de datos
  private initPedido(total: number, item: ItemProducto): Pedido {
    const pedido = new Pedido();
    pedido.id = "";
    pedido.cliente = this.authService.usuario;
    pedido.itemProductos = new Array();
    pedido.itemProductos.push(item);
    pedido.precioTotal = total;
    pedido.estado = "ENVIADO";
    pedido.createAt = new Date();
    return pedido;
  }

  //Valida si hay stock disponible
  public get sinStock():boolean{
    if(this._sinStock){
      return true;
    }
    return false;
  }
  //Agregar producto en el pedido y en el localStorage
  public addProductoPedido(producto: Producto) {

    let item = this.pedido.itemProductos.find((productos) => {
      return productos.producto.id === producto.id;
    });

    if (item !== undefined) {
      item.cantidad++;
      item.producto.total = (producto.precio * item.cantidad);
     
      if(item.cantidad>producto.stock){
        item.cantidad--;
        item.producto.total = (producto.precio * item.cantidad);
        this._sinStock = true; 
      }
    
    } else {
      const addProductoCarrito: ItemProducto = {
        cantidad: 1,
        producto: producto,
      };
      
      
      producto.total = producto.precio;
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

    //Incrementa o disminuye la cantidad de preductos del itemProducto y calcula el total
    this.pedido.itemProductos = this.pedido.itemProductos.map((item) => {
      if (producto.id === item.producto.id) {
        item.cantidad = cantidad;
        item.producto.total = (producto.precio * item.cantidad);
        //Agregar el pedido al local storage
        localStorage.setItem("pedido", JSON.stringify(this.pedido));
      }
      return item;
    });
    //Sumar total
    this.sumarPrecioTotal();
    this.pedido.cliente = this.authService.usuario;
  }

  //Comprobar si hay stock
  private comprobarStock(producto: Producto, pedido: Pedido): void {
    this.productoService.findProductById(producto.id).subscribe(jProductoDb => {
      if (jProductoDb.stock === 0) {
        Swal.fire("Sin stock!", `Lo sentimos pero este producto ya no tiene Stock!`, "warning");
        return;
      } else {
        this.compraService.generarCompra(pedido).subscribe(() => {
        }, err => {
          Swal.fire("Error!", `No se encontro el producto solicitado. Estatus: ${err.error.message}`, "error");
        });
      }

    });
  }

  //Metodo comprar para el detalle del producto
  public comprarProductoDetalle(producto: Producto, cantidad: number, total: number): void {

    const item = new ItemProducto();
    item.cantidad = cantidad;
    item.producto = producto;

    const pedido = this.initPedido(total, item);
    this.comprobarStock(producto, pedido);
  }

  //Metodo comprar para el carrito
  public comprarActualCarrito(producto: Producto, total: number): void {

    const item = this.pedido.itemProductos.find(itemProducto => {
      return itemProducto.producto.id === producto.id;
    });

    const pedido = this.initPedido(total, item);
    this.comprobarStock(producto, pedido);  
    this.eliminarItem(producto.id);
   

  }

  //Eliminar itemProducto
  public eliminarItem(id: string): void {
    this.pedido.itemProductos = this.pedido.itemProductos.filter(
      (item) => id !== item.producto.id
    );
    this._sinStock = false;
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
    let precioTotal: number = 0;
    this.pedido.itemProductos.forEach((itemPreudctos) => {
      precioTotal += Number(itemPreudctos.producto.total);
    });

    this.pedido.precioTotal = precioTotal;
  }


  //Mantiene el producto en el localStorage
  private cargarStorage(): Pedido {
    if (localStorage.getItem("pedido")) {
      this.pedido = JSON.parse(localStorage.getItem("pedido"));
    }
    return this.pedido;
  }
}
