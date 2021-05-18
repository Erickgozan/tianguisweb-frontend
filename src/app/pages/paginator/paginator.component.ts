import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css']
})
export class PaginatorComponent implements OnInit {

  @Input()
  paginador:any;
  paginas:number[];

  desde:number;
  hasta:number;

  constructor() { }

  ngOnInit(): void {
    this.paginas = new Array(this.paginador.totalPages).fill(0).map((valor,indice)=>indice+1);    
  }

  public isFirstPage():any{
    return this.paginador.first;
  }

  public isLastPage():any{
    return this.paginador.last;
  }

}
