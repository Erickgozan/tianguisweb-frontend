import { Component, OnInit } from "@angular/core";
import { Slider } from "src/app/entity/slider";
import { SliderService } from "src/app/service/slider.service";

@Component({
  selector: "app-slider",
  templateUrl: "./slider.component.html",
  styleUrls: ["./slider.component.css"],
})
export class SliderComponent implements OnInit {

  public sliders:Array<Slider>;
  public url:string="http://localhost:8080/api/view/img/";

  constructor(private sliderService:SliderService) {
    this.sliders = new Array();
  }

  ngOnInit(): void {
    this.getAllSliders();  
  } 

  //Guarda el array de sliders
  public getAllSliders(){
    this.sliderService.listSlider().subscribe(jSliders=>{
      this.sliders = jSliders;
    });
  }

}
