import { Body, Controller, Logger, Post } from '@nestjs/common';
import { Login } from '../models';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

@Controller('/login')
export class LoginController {
  @Post()
  async login(@Body() login: Login): Promise<string> {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      login.email,
      login.password,
    );
    const userCollection = collection(firestore, 'userData');
    const userInfo = await getDoc(doc(userCollection, userCredential.user.uid));
    return JSON.stringify({
      userCredentials: userCredential,
      userData: userInfo.data(),
    });
  }
}
