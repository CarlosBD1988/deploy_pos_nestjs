/* eslint-disable @typescript-eslint/no-unsafe-call */
import { IsDateString, IsInt, IsNotEmpty, Max, Min } from "class-validator"

/* eslint-disable prettier/prettier */
export class CreateCouponDto {
  
    @IsNotEmpty({message:"El nombre del cupon es obligatorio"})
    name:string
    
    @IsNotEmpty({message:"El valor no peude ser vacio"})
    @IsInt({message:"El valor debe ser un entero entre 1 y 100"})
    @Max(100,{message:"El descuento debe ser maximo de 100"})
    @Min(1,{message:"El descuento debe ser minimo de 1"})
    percentage:number
    
    @IsNotEmpty({message:"Fecha de vencimiento obligaotoria"})
    @IsDateString({},{message:"Fecha no valida"})
    expirationDate:Date
    
}
