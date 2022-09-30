import { Body, Controller, Logger, Post } from '@nestjs/common';
import { Login } from '../models';
import { RetrieveTestData } from '../firebase.service';

@Controller('/login')
export class LoginController {
  @Post()
  login(@Body() login: Login): boolean {
    RetrieveTestData().then((r) => Logger.log('Firestore showcase completed'));

    return login.email?.length > 0 && login.password?.length > 0;
  }
}