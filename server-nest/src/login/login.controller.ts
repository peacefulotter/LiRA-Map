import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { Login } from '../models';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

@Controller('/login')
export class LoginController {
  @Post()
  @HttpCode(HttpStatus.OK)
  async login(@Body() login: Login): Promise<string> {
    return signInWithEmailAndPassword(auth, login.email, login.password)
      .then((userCredential) => {
        const userCollection = collection(firestore, 'userData');
        return getDoc(doc(userCollection, userCredential.user.uid))
          .then((userInfo) => {
            return JSON.stringify({
              userCredentials: userCredential,
              userData: userInfo.data(),
            });
          })
          .catch((error) => {
            throw new UnauthorizedException(error);
          });
      })
      .catch((error) => {
        throw new UnauthorizedException(error);
      });
  }
}
