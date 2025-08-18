/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { FindManyOptions, Repository } from 'typeorm'
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category) private readonly categoryRepository: Repository<Category>
  ) { }

  create(createCategoryDto: CreateCategoryDto) {
    const category = new Category()
    category.name = createCategoryDto.name
    return this.categoryRepository.save(category)

    //Otra forma de hacerlo mas directa y funciona
    //return this.categoryRepository.save(createCategoryDto)
  }

  findAll() {
    return this.categoryRepository.find()
  }

  async findOne(id: number, products?: string) {

    const options: FindManyOptions<Category> = {
      where: {
        id
      }
    }
    if (products==="true") {
      options.relations = {
        products: true
      },
      options.order={
        products:{
          id:'ASC'
        }
      }
    }
    const category = await this.categoryRepository.findOne(options)
    if (!category) {
      //esta e suna forma de reposnder la peticion generica
      //throw new HttpException("La categoria no existe",404)
      throw new NotFoundException("La categoria no existe")
    }
    return category
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    category.name = updateCategoryDto.name
    return await this.categoryRepository.save(category)
  }

  async remove(id: number) {
    const category = await this.findOne(id)
    return await this.categoryRepository.delete({ id: category.id })
  }
}

