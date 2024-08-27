import { IsDateString, IsEmail, IsEnum, IsOptional, IsString, MinLength} from "class-validator"
import { Role } from "src/enums/role.enum";

export class CreateUserDTO{

    @IsString()
    name:string;
    
    
    @IsEmail()
    email:string;
    
    @IsString()
    @MinLength(6)
    password:string

    @IsOptional()
    @IsDateString()
    birthdAt:Date;

    @IsOptional()
    @IsEnum(Role)
    role: number;
}