/* eslint-disable prettier/prettier */
import { Controller, Get, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()

export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Put()
  UpdateMethod(): string {
    return this.appService.putHello();
  }

}
