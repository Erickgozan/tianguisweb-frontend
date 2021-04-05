import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Cliente } from "src/app/entity/cliente";
import { ItemProducto } from "src/app/entity/itemProducto";
import { Pedido } from "src/app/entity/pedido";
import { Producto } from "src/app/entity/producto";
import { AuthService } from "src/app/service/Auth.service";
import { CarritoService } from "src/app/service/carrito.service";
import { ClienteService } from "src/app/service/cliente.service";
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
  private cliente: Cliente;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    public carritoService: CarritoService,
    private clienteService: ClienteService,
    public compraService: CompraService,
    private authService: AuthService,
    private router: Router
  ) {
    this.producto = new Producto();
    this.pedido = this.carritoService.getPedido();
    this.cliente = new Cliente();
  }

  ngOnInit(): void {

    this.cargarProducto();
    if (this.authService.token) {
      this.obtenerCliente();
    }
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

  private obtenerCliente(): void {
    this.clienteService.findCustumerById(this.authService.usuario.id).
      subscribe(jsonClie => this.cliente = jsonClie)
  }

  //Genera el pedido
  public generarPedido(producto: Producto): void {
    if (this.authService.isAuthenticated()) {
      if (this.cliente.direccion == null) {
        Swal.fire("Bien ya pronto sera tuyo", "Necesitamos saber tu dirección.", "info")
          .then(result => {
            if (result.isConfirmed) {
              this.router.navigate(["cliente/form/direccion", this.authService.usuario.id]);
            }
          });
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
            this.carritoService.addProductoDetalle(producto, this.cantidad, this.total);
            if (this.pedido != null) {
              this.compraService.generarCompra(this.pedido).subscribe();
            }
            Swal.fire(
              `Ya es tuyo ${this.cliente.nombre} ${this.cliente.apellido}!`,
              'Hemos confirmado tu compra.',
              'success'
            ).then(result => {
              if (result.isConfirmed) {
                this.carritoService.eliminarItem(producto.id);
              }
            });

          }
        });
      }
    } else {
      this.router.navigate(["/cliente/login"]);
    }
  }




  //Selecciona y muestra la imagen del producto.
  public seleccionarImg(img: string): void {
    this.imagen = img;
  }

}
