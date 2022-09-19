import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '../models';

@Controller('/login')
export class LoginController {
  @Post()
  login(@Body() login: Login): boolean {
    if (login.email?.length > 0 && login.password?.length > 0) {
      return true;
    } else {
      return false;
    }
  }
}
