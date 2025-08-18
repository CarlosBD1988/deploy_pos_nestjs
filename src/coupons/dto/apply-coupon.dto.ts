/* eslint-disable prettier/prettier */
import { IsNotEmpty } from "class-validator";

export class ApplyCouponDto {

    @IsNotEmpty({message:"Nombre cupon obligatorio para aplicar descuento"})
    coupon_name:string

}