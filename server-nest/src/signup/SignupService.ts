import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectConnection, Knex } from 'nestjs-knex';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SignupService {
  constructor(@InjectConnection('postgis') private readonly knex: Knex) {}

  async createUser(email: string, password: string) {
    try {
      const rounds = 12;
      const salt = await bcrypt.genSalt(rounds);
      const hashedAndSaltedPassword = await bcrypt.hash(password, salt);
      console.log(this.knex.table('users'));
      const users = await this.knex.table('users').insert({
        email: email,
        password: hashedAndSaltedPassword,
        salt: salt,
      });
      console.log(users);
      return { users };
    } catch (error) {
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
