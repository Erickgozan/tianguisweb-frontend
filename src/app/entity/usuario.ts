import { Role } from "./role";

export class Usuario{ 
    public id:string;
    public password:string;
    public confirmPasword:string;
    public email:string;
    public habilitado:boolean;
    public roles:Array<Role>;
    public rolesString:string[]=[];
}