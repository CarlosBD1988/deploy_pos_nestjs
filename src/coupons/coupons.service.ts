/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Coupon } from './entities/coupon.entity';
import { Repository } from 'typeorm';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { endOfDay, isAfter } from 'date-fns';

@Injectable()
export class CouponsService {
  constructor(
    @InjectRepository(Coupon) private readonly couponRepository: Repository<Coupon>
  ) { }

  create(createCouponDto: CreateCouponDto) {
    return this.couponRepository.save(createCouponDto)
  }

  async findAll() {
    return await this.couponRepository.find()
  }

  async findOne(id: number) {
    const cupon = await this.couponRepository.findOneBy({ id })
    if (!cupon) {
      throw new NotFoundException(`Cupon con id: ${id} no existe.`)
    }
    return cupon
  }

  async update(id: number, updateCouponDto: UpdateCouponDto) {
    const cupon = await this.findOne(id)
    Object.assign(cupon, updateCouponDto)
    return await this.couponRepository.save(cupon)
  }

  async remove(id: number) {
    const cupon = await this.findOne(id)
    await this.couponRepository.remove(cupon)
    return "Cupon eliminado"

  }

  async applyCoupon(couponName:string) {
    const cupon = await this.couponRepository.findOneBy({name:couponName })
    if (!cupon) {
      throw new NotFoundException("Cupon no existe")
    }
    const currentDate=new Date()
    const expirationDate=endOfDay(cupon.expirationDate)
    if(isAfter(currentDate,expirationDate)){
      throw new UnprocessableEntityException("Cupon ya expirado")
    }

    return {
      message:"Cupon valido",
      ...cupon
    }
  }





}
