/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import {IsString,IsNotEmpty} from 'class-validator'

export class CreateCategoryDto {
    @IsString()
    @IsNotEmpty({
        message:"El nombre de la categoria no puede ser vacio"
    })
    name:string
}
