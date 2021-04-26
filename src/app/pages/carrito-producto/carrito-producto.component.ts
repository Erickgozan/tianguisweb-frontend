import { Component, OnInit } from "@angular/core";
import {  Router } from "@angular/router";
import { Cliente } from "src/app/entity/cliente";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { AuthService } from "src/app/service/Auth.service";
import { CarritoService } from "src/app/service/carrito.service";
import { ClienteService } from "src/app/service/cliente.service";

import Swal from "sweetalert2";

@Component({
  selector: "app-carrito-producto",
  templateUrl: "./carrito-producto.component.html",
  styleUrls: ["./carrito-producto.component.css"],
})
export class CarritoProductoComponent implements OnInit {
  public pedido: Pedido;
  public producto: Producto;
  public cliente: Cliente;

  constructor(private carritoService: CarritoService,
    private clienteService: ClienteService,
    private authService: AuthService,
    private router: Router) {

    this.pedido = carritoService.getPedido();
    this.cliente = new Cliente();
    this.producto = new Producto();
  }

  ngOnInit(): void {

    if (this.authService.token) {
      this.obtenerCliente();
    }

  }

  private obtenerCliente(): void {
    this.clienteService.findCustumerById(this.authService.usuario.id).
      subscribe(jsonClie => this.cliente = jsonClie)
  }

  //Actualizar la cantidad del producto
  public actualizarCantidad(producto: Producto, event: any): void {
    let cantidad = event.target.value as number;
    if (cantidad > producto.stock) {
      Swal.fire("Lo sentimos!", "No hay stok disponible.", "warning");
      event.target.value = 1;
    }

    this.carritoService.addProductoPedidoChange(producto, event);
  }

  //Elimina el item del producto
  public eliminarProducto(producto: Producto) {
    Swal.fire({
      title: `Quitar del carrito!`,
      text: `¿Estas seguro de que deseas eliminar el producto ${producto.nombre}?`,
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

  public generarPedido(producto: Producto): void {

    if (this.authService.isAuthenticated()) {
      if (this.cliente.direccion.id===undefined) {
        this.cliente.direccion=null;
        return;
      } else {
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
            this.carritoService.comprarActualCarrito(producto, producto.total);
            Swal.fire(
              `Ya es tuyo ${this.authService.usuario.nombre}!`,
              'Hemos confirmado tu compra.',
              'success'
            );
          }  
        });
      }
    } else {
      this.router.navigate(["/cliente/login"]);
    }
  }


}
