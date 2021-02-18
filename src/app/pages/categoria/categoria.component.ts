import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Categoria } from "src/app/entity/categoria";
import { CategoriaService } from "src/app/service/categoria.service";
import { ProductoService } from "src/app/service/producto.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-categoria",
  templateUrl: "./categoria.component.html",
})
export class CategoriaComponent implements OnInit {
  public categoria: Categoria;
  public categorias: Categoria[];
  public errores: string[];
  public habilitar: boolean;
  public buttonValue: string = "";
  public idSeleccionado: number;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.categoria = new Categoria();
    this.habilitar = false;
  }

  ngOnInit(): void {}

  //Listar las categorias.
  public ListarCategorias(): void {
    this.productoService.categoriaList().subscribe((categors) => {
      this.categorias = categors;
    });
    //Metodo para ocultar o mostrar el listado de categorias
    this.habilitar = this.habilitar == true ? false : true;
  }

  //Crear categoria.
  public crearCategoria(): void {
    this.categoriaService.saveCategory(this.categoria).subscribe(
      (catego) => {
        this.categoria = catego;
        Swal.fire(
          "Genial!",
          `La categoria se agrego con éxito!`,
          "success"
        ).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });
        this.router.navigate(["/productos/form"]);
      },
      (err) => {
        this.errores = err.error.error_400 as string[];
        if (err.status == 500) {
          Swal.fire("Error! ", `Error: ${err.error.message}`, "error");
        }
      }
    );
  }
  //Eliminar las categorias.
  public eliminarCategoria(categoria: Categoria): void {
    Swal.fire({
      title: "Estas seguro que deseas eliminar esta categoria?",
      text: "Esta acción no se puede revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminar!",
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoriaService.delateCategory(categoria.id).subscribe(
          () => {
            this.categorias = this.categorias.filter(
              (cat) => cat !== categoria
            );
          },
          (err) => {
            //Manejo del error del servidor
            if (err.status == 500) {
              Swal.fire("Error!", `${err.error.error_500}`, "error");
            }
            console.log(err);
          }
        );
      }
    });
  }

  //Selecciona la categoria para editarla
  public seleccionarCategoria(id: number): void {
    this.idSeleccionado = id;
  }

  public editarCategoria(categoria): void {
    this.categoriaService.editCategory(categoria).subscribe((json) => {
      Swal.fire(
        "Genial!",
        `La categoria ${categoria.nombre} se actualizo correctamente`,
        "success"
      ).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(["/productos/form"]);
          location.reload();
        }
      });
    });
  }

  //Metodo para ocultar o mostrar el listado de categorias
  public ocultarListaCategoria(): void {
    this.habilitar = this.habilitar == true ? false : true;
  }

  //Metodo para cambiar el texto del boton de las categorias
  public getButtonValue(): string {
    return (this.buttonValue =
      this.habilitar == true ? "Ocultar categorias" : "Listar categorias");
  }

  //Metodo para cancelar la edicion.
  public cancelarEdicion(): void {
    this.idSeleccionado = null;
  }

  //Metodo para regresar a la ruta del formulario al cerrar el modal
  public cerrar(): void {
    this.router.navigate(["/productos/form"]);
  }
}
