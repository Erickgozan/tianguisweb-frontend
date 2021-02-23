import { Cliente } from "./cliente";

export class Direccion{  
    public id:number;
    public calle:string;//0
    public colonia:string;//1
    public noExterior:number;//0
    public noInterior:number;//0
    public municipio:string;//1
    public cp:number;//1
    public estado:string;//1
    public clientes:Array<Cliente>;
    public mensaje:string;
    public direccion:any;
}