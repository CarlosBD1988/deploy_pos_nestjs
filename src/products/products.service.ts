/* eslint-disable prettier/prettier */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { FindManyOptions, Repository } from 'typeorm';
import { Category } from '../categories/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private readonly productRepository:Repository<Product>,
    @InjectRepository(Category) private readonly categoryRepository:Repository<Category>
  ){}

  async create(createProductDto: CreateProductDto) {

    const category= await this.categoryRepository.findOneBy({id:createProductDto.categoryId})
    if(!category){
      let errors:string[]=[]
      errors.push("La categoria no existe, no es posible crear el producto")
      throw new NotFoundException(errors)
    }

    return this.productRepository.save({
      ...createProductDto,
      category
    })

    
    
  }

  async findAll(categoryId:number| null,take:number,skip:number) {

    const options:FindManyOptions<Product> ={
      relations:{
        category:true
      },
      order:{
        id:'ASC'
      },
      take,
      skip
   }
    
    if(categoryId){
      options.where= {
            category:{
              id:categoryId
            }
          }
      const [products,total] = await this.productRepository.findAndCount(options)      
      return {
        products,
        total
      }
    }
   const [products,total] = await this.productRepository.findAndCount(options)
   return {
    products,
    total
   }
  }

  async findOne(id: number) {    
    const product=await this.productRepository.findOne({
      where:{
        id
      },
      relations:{
        category:false
      }
    })
    if(!product){
      throw new NotFoundException(`Producto con el id ${id} no existe`)
    }
    return product

  }

  async update(id: number, updateProductDto: UpdateProductDto) {

     const product=await this.productRepository.findOne({
      where:{
        id
      }     
    })
    if(!product){
      throw new NotFoundException(`Producto con el id ${id} no existe, no es posible actualizar`)
    }

    if(updateProductDto.categoryId)
    {      
      const category=await this.categoryRepository.findOne({
        where:{
          id:updateProductDto.categoryId
        }     
      })
      if(!category){
        throw new NotFoundException(`Categoria asignada al producto no existe, no es posible actualizar`)
      }
      product.category=category
    }

    Object.assign(product,updateProductDto)    
    return await this.productRepository.save(product)
  }

  async remove(id: number) {
   
    const product=await this.productRepository.findOne({
      where:{
        id
      }     
    })
    if(!product){
      throw new NotFoundException(`Producto con el id ${id} no existe, no es posible eliminar`)
    }
     await this.productRepository.delete(product)
     return {
      message:"Producto eliminado correctamente"
     }

  }
}
