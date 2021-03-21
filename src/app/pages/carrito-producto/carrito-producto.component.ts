import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/entity/cliente";
import { EstadoPedido } from "src/app/entity/estadoPedido.enum";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { CarritoService } from "src/app/service/carrito.service";
import { ClienteService } from "src/app/service/cliente.service";
import { CompraService } from "src/app/service/compra.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-carrito-producto",
  templateUrl: "./carrito-producto.component.html",
  styleUrls: ["./carrito-producto.component.css"],
})
export class CarritoProductoComponent implements OnInit {
  public pedido: Pedido;
  public cliente: Cliente;

  constructor(private carritoService: CarritoService,
    private clienteService: ClienteService,
    private compraService: CompraService) {

    this.pedido = carritoService.getPedido();
    this.cliente = new Cliente();
    this.pedido.cliente = new Cliente();

  }

  ngOnInit(): void {
    this.cargarClinete();
  }

  //Actualizar la cantidad del producto
  public actualizarCantidad(producto: Producto, event: any): void {
    this.carritoService.addProductoPedidoChange(producto, event);
  }

  //Elimina el item del producto
  public eliminarProducto(producto: Producto) {
    Swal.fire({
      title: `¿Estas seguro de que deseas eliminar el producto ${producto.nombre}?`,
      text: "Esta operación ya no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.carritoService.eliminarItem(producto.id);
        Swal.fire(
          "Eliminado!",
          `El producto ${producto.nombre} ha sido eliminado exitosamente!.`,
          "success"
        );
      }
    });
  }

//Temporal para probar la logica de el metodo generar pedido
  public cargarClinete(): void {
    this.clienteService.findCustumerById("cc6dd638-1106-4afd-bc2b-54da2301d5ff")
      .subscribe(jsonCiente => {
        this.cliente = jsonCiente;
        this.pedido.cliente.nombre = this.cliente.nombre;
        this.pedido.cliente.apellidoMaterno = this.cliente.apellidoMaterno;
        this.pedido.cliente.apellidoPaterno = this.cliente.apellidoPaterno;
        this.pedido.cliente.direccion = this.cliente.direccion;
        this.pedido.cliente.email = this.cliente.email;
        this.pedido.cliente.fechaCompra = this.cliente.fechaCompra;
        this.pedido.cliente.telefono = this.cliente.telefono;
        this.pedido.cliente.username = this.cliente.username;
        this.pedido.cliente.habilitado = this.cliente.habilitado;
        this.pedido.cliente.id = this.cliente.id;
        this.pedido.estado = EstadoPedido.ENVIADO;
      })
  }


  public generarPedido(item: ItemProducto): void {

    this.pedido.itemProductos = new Array();
    this.pedido.precioTotal = item.producto.precio;
    this.pedido.itemProductos.push(item);

    Swal.fire({
      title: 'Confirmar la compra?',
      text: `${item.producto.nombre}`,
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
        ).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
      } else {
        location.reload();
      }
    });
  }
}
