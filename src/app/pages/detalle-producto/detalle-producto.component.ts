import { Component,  OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Categoria } from "src/app/entity/categoria";
import { Cliente } from "src/app/entity/cliente";
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
  public imagen: string;
  public total: number;
  public cantidad: number = 1;
  public cliente: Cliente;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productoService: ProductoService,
    public carritoService: CarritoService,
    private clienteService: ClienteService,
    public compraService: CompraService,
    public authService: AuthService,
    private router: Router
  ) { 
    //this.pedido = this.carritoService.getPedido();
    this.cliente = new Cliente();
    this.producto = new Producto();
    this.producto.categoria = new Categoria();
    this.cargarProducto();
  }

  ngOnInit(): void {
    if (this.authService.token) {
        this.obtenerCliente(this.authService.usuario.id);
    }
  }

  //Muestra el producto en base a su id
  public cargarProducto(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params.id;
      if (id != null ) {
        this.productoService
          .findProductById(id)
          .subscribe((producto) => {
            this.producto = producto
            this.total = this.producto.precio;
          });
      }
    });
  }

  private obtenerCliente(id:string): void {
    this.clienteService.findCustumerById(id).
      subscribe(jsonClie => {
        this.cliente = jsonClie
      });
  }
  //Actualizar la cantidad del producto
  public actualizarCantidad(event: any): void {
    let cantidad = event.target.value as number;
    if (cantidad > this.producto.stock) {
      Swal.fire("Lo sentimos!", "No hay stok disponible.", "warning");
      event.target.value = 1;
      this.total = this.producto.precio;
    } else {
      this.total = this.producto.precio * cantidad;
      this.cantidad = cantidad;
    }
  }



  //Genera el pedido
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
            this.carritoService.comprarProductoDetalle(producto, this.cantidad, this.total);
            Swal.fire(
              `Ya es tuyo ${this.authService.usuario.nombre}!`,
              'Hemos confirmado tu compra.',
              'success'
            ).then(result => {
              if (result.isConfirmed) {           
                location.reload();
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
