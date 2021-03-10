import { Cliente } from "./cliente";

export class Direccion{  
    public id:string;
    public calle:string;
    public colonia:string;
    public noExterior:number;
    public noInterior:number;
    public municipio:string;
    public cp:number;
    public estado:string;
    public clientes:Array<Cliente>;
}