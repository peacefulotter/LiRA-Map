import { Body, Controller, Post } from "@nestjs/common";
import { Login } from "../models";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

@Controller("/signup")
export class SignupController {
  @Post()
  signup(@Body() login: Login) {
    console.log(login);
    createUserWithEmailAndPassword(auth, login.email, login.password)
      .then((userCredentials) => {
        const user = userCredentials;
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
