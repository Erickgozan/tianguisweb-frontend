import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Slider } from 'src/app/entity/slider';
import { SliderService } from 'src/app/service/slider.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-slider',
  templateUrl: './form-slider.component.html',
  styleUrls: ['./form-slider.component.css']
})
export class FormSliderComponent implements OnInit {

  public slider: Slider;
  public files: Array<File>;
  public id: string;
  // public sliders:Slider[]=[];

  constructor(private sliderService: SliderService,
    private router: Router) {
    this.slider = new Slider();
    this.files = new Array();
  }

  ngOnInit(): void {
    this.getSlider();
  }

  public fotosSeleccionadas(event: { target: { files: File[]; }; }) {
    this.files = event.target.files;
  }

  public crearSlider() {    
    this.sliderService.crateSlider(this.files).subscribe(() => {
      Swal.fire("Nuevo slider.", "Se ha creado el slider con exito", "success");
      this.router.navigate(["/"]);
    }, (err) => {
      if (err.status == 500) {
        Swal.fire("Error!", `${err.error.error_500}`, "error");
      }
    });


  }

  public getSlider(): void {
    this.sliderService.listSlider().subscribe(jSlider => {
      jSlider.forEach(slider => {
        this.slider = slider;
      })
    });
  }

  public actualizarImg() {
    let file = this.files[0];
    this.sliderService.updateImgSlider(file,this.slider.id).subscribe(()=>{
       if (!file) {
          Swal
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

        }else {
          Swal
            .fire({
              icon: "success",
              title: "Genial!",
              text: `La imagen ${file.name} se subio correctamente`,
            })
            .then((result) => {
              if (result.isConfirmed) {
                location.reload();
              }
            });
        }
    },err=>{    
      if (err.stattus == 500) {
        Swal.fire("Error!", `Error: ${err.error.message}`, "error");
      }
    })
  }

  public eliminarImg(img: string) {
    Swal.fire({
      title: 'Estas seguro de que quieres eliminar la imagen?',
      text: `${img}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.sliderService.delateImgSlider(this.slider.id, img).subscribe(() => {     
        }, err => {
          if (err.status == 404) {
            Swal.fire("Error!", `${err.error.error_404}`, "error");
          } else if (err.status == 500) {
            Swal.fire("Error!", `${err.error.error_500}`, "error");
          }
        });
        Swal.fire(
          'Eliminada!',
          `La imagen. ${img} se ha eliminado con éxito!`,
          'success'
        ).then(result=>{
            if(result.isConfirmed){
              location.reload();
            }
        })
      }
    });
  }

}
