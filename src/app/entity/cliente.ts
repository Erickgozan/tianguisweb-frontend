import { Direccion } from "./direccion";
import { Producto } from "./producto";
import { Usuario } from "./usuario";

export class Cliente extends Usuario {
    
    public nombre: string;
    public apellidoPaterno: string;
    public apellidoMaterno: string;
    public telefono: string;
    public direccion: Direccion;
    public producto: Array<Producto>;
    public fechaCompra: Date;
    //Argumento de respuesta que viene del servidor
    public mensaje:string;

}
