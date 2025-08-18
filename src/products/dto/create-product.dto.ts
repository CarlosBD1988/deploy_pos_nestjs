/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsNumber, IsString } from "class-validator"

/* eslint-disable prettier/prettier */
export class CreateProductDto {

    @IsNotEmpty({ message: "El nombre del producto es obligatorio" })
    @IsString({ message: "Nombre de producto invalido" })
    name: string


    @IsNotEmpty({ message: "Imagen obligatoria" })    
    image: string

    @IsNotEmpty({ message: "El precio del producto es obligatorio" })
    @IsNumber({ maxDecimalPlaces: 2, allowNaN: false }, { message: "Precio no valido" })
    price: number

    @IsNotEmpty({ message: "El inventario inicial del producto es obligatorio" })
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false }, { message: "Valor de inventario no valido" })
    inventory: number


    @IsNotEmpty({ message: "Categoria del producto es obligatorio" })
    @IsInt({ message: "Categoria no valida" })
    categoryId: number


}
