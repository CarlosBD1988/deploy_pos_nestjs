/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello Nest.js!';
  }

  putHello():string{
    return 'Desde metodo de actualizacion from appservice';
  }
}
