/* eslint-disable prettier/prettier */
import { IsNumberString, IsOptional } from "class-validator";

/* eslint-disable prettier/prettier */
export class GetProductsQueryDto{
    @IsOptional()
    @IsNumberString({},{message:'La Categoria debe ser un numero.'})
    category_id?:number

    @IsOptional()
    @IsNumberString({},{message:'La Cantidad debe ser un numero.'})
    take?:number

    @IsOptional()
    @IsNumberString({},{message:'La Cantidad debe ser un numero.'})
    skip?:number

}