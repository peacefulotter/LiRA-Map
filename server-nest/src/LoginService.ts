import { Controller, Post } from '@nestjs/common';

@Controller('login')
export class LoginService {
  @Post('/login')
  login(): Promise<boolean> {
    return true;
  }
}
