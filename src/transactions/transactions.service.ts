/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction, TransactionContents } from './entities/transaction.entity';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { endOfDay, isValid, parseISO, startOfDay } from 'date-fns';
import { CouponsService } from '../coupons/coupons.service';

@Injectable()
export class TransactionsService {

  constructor(
    @InjectRepository(Transaction) private readonly transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionContents) private readonly transactionContentRepository: Repository<TransactionContents>,
    @InjectRepository(Product) private readonly productRepository: Repository<Product>,

    private readonly couponService: CouponsService

  ) { }

  async create(createTransactionDto: CreateTransactionDto) {

    await this.productRepository.manager.transaction(async (transactionEntityManager) => {

      const transaction = new Transaction()

      const total = createTransactionDto.contents.reduce((total, item) => total + (item.quantity * item.price), 0)
      transaction.total = total

      if (createTransactionDto.coupon) {
        const cupon = await this.couponService.applyCoupon(createTransactionDto.coupon)
        const discount = (cupon.percentage / 100) * total
        transaction.discount = discount
        transaction.coupon = cupon.name
        transaction.total -= discount
      }

      for (const contents of createTransactionDto.contents) {

        const product = await transactionEntityManager.findOneBy(Product, { id: contents.productId })

        const errors: string[] = [];

        if (!product) {
          errors.push(`Producto con id: ${contents.productId} no existe, no es posible almancenar la venta`)
          throw new NotFoundException(errors)
        }

        if (contents.quantity > product.inventory) {
          errors.push(`Producto ${product.name} no tiene sufienciente inventario, no es posible almancenar la venta`)
          throw new BadRequestException(errors)
        }
        product.inventory -= contents.quantity

        //crear instancia de TransactionContents.
        const transactionContent = new TransactionContents()
        transactionContent.price = contents.price
        transactionContent.product = product
        transactionContent.quantity = contents.quantity
        transactionContent.transaction = transaction

        await transactionEntityManager.save(transaction)
        await transactionEntityManager.save(transactionContent)
      }
    })
    return {
      message: "Venta Almacenda correctamente"
    }

  }

  findAll(transactionDate: string) {
    const options: FindManyOptions<Transaction> = {
      relations: {
        contents: true
      }
    }

    if (transactionDate) {
      const date = parseISO(transactionDate)
      if (!isValid(date)) {
        throw new BadRequestException("Invalid date")
      }
      const start = startOfDay(date)
      const end = endOfDay(date)
      options.where = {
        transactionDate: Between(start, end)
      }

    }

    return this.transactionRepository.find(options)
  }

  async findOne(id: number) {
    const transaction = await this.transactionRepository.findOne({
      where: {
        id
      },
      relations: {
        contents: true
      }
    })

    if (!transaction) {
      throw new NotFoundException("Transaccion no existe")
    }
    return transaction
  }

  update(id: number, updateTransactionDto: UpdateTransactionDto) {
    throw new BadRequestException("not implemented method")
  }

  async remove(id: number) {
    const transaction = await this.findOne(id)

    for (const contents of transaction.contents) {

      const product = await this.productRepository.findOneBy({ id: contents.product.id })
      product!.inventory += contents.quantity
      await this.productRepository.save(product!)

      const transactionContents = await this.transactionContentRepository.findOneBy({ id: contents.id })
      await this.transactionContentRepository.remove(transactionContents!)
    }
    await this.transactionRepository.remove(transaction)
    return "venta eliminada"
  }
}
