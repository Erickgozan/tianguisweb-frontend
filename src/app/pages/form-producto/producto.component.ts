import { Component, OnInit } from "@angular/core";
import { Producto } from "src/app/entity/producto";
import { ProductoService } from "src/app/service/producto.service";
import { ActivatedRoute, Params } from "@angular/router";
import { Categoria } from "src/app/entity/categoria";
import { Router } from "@angular/router";
import swal from "sweetalert2";
import { CategoriaService } from "src/app/service/categoria.service";

@Component({
  selector: "app-producto",
  templateUrl: "./producto.component.html",
  styleUrls: ["./producto.component.css"],
})
export class ProductoComponent implements OnInit {
  public producto: Producto;
  public categoria: Categoria;
  public errores: Array<string>;
  public files: Array<File>;
  public categorias: Array<Categoria>;
  public fotoSeleccionada: boolean = false;

  constructor(
    private productoService: ProductoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.producto = new Producto();
    this.categoria = new Categoria();
  }

  ngOnInit(): void {
    this.productoService.categoriaList().subscribe((categorias) => {
      this.categorias = categorias;
    });

    this.cargarProducto();
  }
  //Cargar las imagenes seleccionadas
  public fotosSeleccionadas(event: { target: { files: File[] } }) {
    this.files = event.target.files;
  }

  //Crear el producto
  public crearProducto(): void {
    if (this.files == null) {
      swal.fire({
        icon: "error",
        title: "Ups...Error!",
        text: "Debes de seleccionar una imagen",
      });
    } else {
      this.productoService.saveProduct(this.files, this.producto).subscribe(
        (producto) => {
          this.producto = producto;

          swal.fire(
            "Nuevo producto",
            `Se ha creado el producto ${this.producto.nombre} con éxito`,
            "success"
          );
          this.router.navigate(["/"]);
        },
        (err) => {
          this.errores = err.error.error_400 as string[];
          if (err.status == 500) {
            swal.fire("Error! ", `Error: ${err.error.message}`, "error");
          }
        }
      );
    }
  }

  //Actualizar producto
  public actualizarProducto(): void {
    this.productoService.updateProduct(this.producto).subscribe((json) => {
      swal.fire(
        "Actualizar producto",
        `Se ha actualizado el producto ${json.producto.nombre} con éxito`,
        "success"
      );
      this.router.navigate(["/"]);
    }),
      (err: any) => {
        this.errores = err.error.error_404 as string[];
        if (err.status == 500) {
          swal.fire("Error!", `Error: ${err.error.message}`, "error");
        }
      };
  }

  //Actualizar la imagen
  public actualizarImg(): void {
    this.productoService
      .updateImg(this.files, this.producto.id)
      .subscribe((imagenes) => {
        this.producto = imagenes;
        if (!this.files) {
          swal
            .fire({
              icon: "error",
              title: "Ups...Error!",
              text: "Debes de seleccionar una imagen",
            })
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        } else {
          swal
            .fire({
              icon: "success",
              title: "Genial!",
              text: `La imagen ${this.files[0].name} se subio correctamente`,
            })
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        }
      }),
      (err: any) => {
        this.errores = err.error.errores as Array<string>;
        if (err.stattus == 500) {
          swal.fire("Error!", `Error: ${err.error.message}`, "error");
        }
      };
  }

  //Actualiza todas las imagenes cuando no hay ninguna
  public actualizarImgs(): void {
    this.productoService
      .updateImgs(this.files, this.producto.id)
      .subscribe((images) => {
        this.producto = images;
        if (!this.files) {
          swal
            .fire({
              icon: "error",
              title: "Ups...Error!",
              text: "Debes de seleccionar una imagen",
            })
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        } else {
          swal
            .fire({
              icon: "success",
              title: "Genial!",
              text: `La imagen ${this.files[0].name} se subio correctamente`,
            })
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        }
      }),
      (err: any) => {
        this.errores = err.error.error as string[];
        if (err.stattus == 500) {
          swal.fire("Error!", `Error: ${err.error.message}`, "error");
        }
      };
  }

  //Eliminar la imagen
  public eliminarImg(img: string): void {
    swal
      .fire({
        title: "Estas seguro de que quieres eliminar la imagen?",
        text: "Esta accion no se podra revertir!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminar!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.productoService
            .delteImg(this.producto.id, img)
            .subscribe((jsonResponse) => {
              swal
                .fire("Eliminada!", `${jsonResponse.mensaje}`, "success")
                .then((result) => {
                  if (result.isConfirmed) {
                    location.reload();
                  }
                });
            });
        }
      });
  }

  //Cargar el producto
  public cargarProducto(): void {
    this.activatedRoute.params.subscribe((params) => {
      let id = params.id;
      if (id != null) {
        this.productoService.findProductById(id).subscribe((producto) => {
          this.producto = producto;
          console.log(producto);
        });
      }
    });
  }

  //Verificar si el producto tiene una categoria asignada
  public compararCategoria(obj1: Categoria, obj2: Categoria): boolean {
    if (obj1 === undefined && obj2 === undefined) {
      return true;
    }
    return obj1 === null ||
      obj2 === null ||
      obj1 === undefined ||
      obj2 === undefined
      ? false
      : obj1.id === obj2.id;
  }
}
