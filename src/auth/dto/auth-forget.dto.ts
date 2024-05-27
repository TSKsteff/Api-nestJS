import { IsEmail, IsString, MinLength } from "class-validator";


export class AuthforgetDTO{

    @IsEmail()
    email:string;

}