import { Body, Controller, Post } from '@nestjs/common';
import { Login } from '../models';
import { SignupService } from './SignupService';

@Controller('/signup')
export class SignupController {
  constructor(private readonly signupService: SignupService) {}
  @Post()
  signup(@Body() login: Login) {
    this.signupService.createUser(login.email, login.password).then((r) => {
      console.log(r);
      return r;
    });
  }
}
