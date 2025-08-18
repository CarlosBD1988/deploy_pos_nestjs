/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../categories/entities/category.entity';
import { Repository,DataSource } from 'typeorm';
import { products } from './data/product';
import { Product } from '../products/entities/product.entity';
import { categories } from './data/category';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Category) private readonly categoryRepository: Repository<Category>,
        @InjectRepository(Product) private readonly productRepository: Repository<Product>,
        private readonly dataSource:DataSource
    ) {}
    
    async onModuleInit(){
        const connection=this.dataSource
        await connection.dropDatabase()
        await connection.synchronize()
    }

    async seed() {
        //console.log("Desde seeder.service.ts ....")
        await this.categoryRepository.save(categories);

        for (const seedproduct of products) {
            const category = await this.categoryRepository.findOneBy({ id: seedproduct.categoryId })

            const product = new Product()
            product.name = seedproduct.name
            product.image = seedproduct.image
            product.price = seedproduct.price
            product.inventory = seedproduct.inventory
            product.category = category!

            await this.productRepository.save(product)

        }
    }
}
