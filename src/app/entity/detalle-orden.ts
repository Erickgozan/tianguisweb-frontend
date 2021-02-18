import { Producto } from "./producto";

export class DetalleOrden{
    public id:number;
    public producto:Producto;
    public numOrden:number;
    public cantidad:number;
    public fecha:Date;
    
}