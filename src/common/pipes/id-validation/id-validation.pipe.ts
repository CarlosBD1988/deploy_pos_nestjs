/* eslint-disable prettier/prettier */
import { BadGatewayException, Injectable, ParseIntPipe } from '@nestjs/common';

@Injectable()
export class IdValidationPipe extends ParseIntPipe {
  constructor(){
    super({
      exceptionFactory:()=>new BadGatewayException('Id no valido...')
    })
  }

}
