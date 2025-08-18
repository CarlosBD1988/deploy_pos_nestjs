/* eslint-disable prettier/prettier */
import { Category } from "../../categories/entities/category.entity";
import { Column, Entity,  ManyToOne,  PrimaryGeneratedColumn } from "typeorm";

// eslint-disable-next-line prettier/prettier
@Entity()
export class Product {

    @PrimaryGeneratedColumn()
    id:number

    @Column({type:'varchar',length:60})
    name:string

    @Column({type:'varchar',length:120,nullable:true,default:'default.svg'})
    image:string
    
    @Column({type:'decimal'})
    price:number

    @Column({type:'int'})
    inventory:number

    @ManyToOne(()=>Category)
    category:Category

  @Column({type:'int'})
    categoryId:number        

}
