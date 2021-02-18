import { Direccion } from "./direccion";
import { Producto } from "./producto";

export class Cliente {

    public nombre: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public telefono: string;
    public direccion: Direccion;
    public producto: Array<Producto>;
    public fechaCompra: Date;

}
