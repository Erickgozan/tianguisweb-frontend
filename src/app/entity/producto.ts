import { Categoria } from "./categoria";

export class Producto {
  public id: string;
  public nombre: string;
  public precio: number;
  public precioOriginal:number;
  public total:number;
  public descripcion: string;
  public caracteristicas: string;
  public stock: number;
  public oferta: boolean;
  public createAt: Date;
  public categoria: Categoria;
  public img1: string;
  public img2: string;
  public img3: string;
  public img4: string;
  public img5: string;
}
