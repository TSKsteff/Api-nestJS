import { AuthRegisterDTO } from './dto/auth-register.dto';
import { UserService } from './../user/user.service';
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { MailerService } from '@nestjs-modules/mailer';
import { UserEntity } from 'src/user/entity/entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService{
    
    constructor(
        private readonly jWtsService: JwtService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly mailer: MailerService,
        private readonly userService:UserService){}

    createToken(user: UserEntity){
        return {
            accesToken: this.jWtsService.sign({
                id: user.id,
                name: user.name  ,
                email: user.email
            },{
                expiresIn: '2 days',
                subject: String(user.id),
                issuer: 'login',
                audience: 'Users'
            })
        }
    }
    checkToken(token: string){
        try{    
            const data = this.jWtsService.verify(token, {
                audience: 'Users',
                issuer: 'login',
            });
            return data;
        }catch(e){
            throw new BadRequestException(e);
        }
    }

    async login(email:string, password:string){

        const user = await this.userRepository.findOne({ 
            where:{
                email
            }
        });

        if(!user){
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        if(!await bcrypt.compare(password, user.password)){ 
            throw new UnauthorizedException('E-mail e/ou senha incorretos.');
        }

        return this.createToken(user);
    }

    async forget(email:string){

        const user = await this.userRepository.findOne({
            where:{
                email
            }
        });

        if(!user){
            throw new UnauthorizedException('E-mail está incoreto');
        }

        const token = this.jWtsService.sign({
            id: user.id,
        },{
            expiresIn: '30 minutes',
            subject: String(user.id),
            issuer: 'forget',
            audience: 'Users'
        })
        await this.mailer.sendMail({
            subject: 'Recuperação de senha',
            to: 'steffkerry1.3@gmail.com',
            template: 'forget',
            context:{
                name: user.name,
                token
            }
        })
        return true;
    }

    async reset(password:string, token:string){
        
        try{    
            const data:any = this.jWtsService.verify(token, {
                issuer: 'forget',
                audience: 'Users'
            });

            if(isNaN(Number(data.id))){
                throw new BadRequestException("Token é invalido");
            }
            
            password =  await bcrypt.hash(password, await bcrypt.genSalt());

            await this.userRepository.update(Number(data.id),{
                    password
            });

            const user = await this.userService.show(Number(data.id));

            return this.createToken(user);
        }catch(e){
            throw new BadRequestException(e);
        }
    }

    async register(data: AuthRegisterDTO){
        const user = await this.userRepository.create(data);
        return this.createToken(user);
    }

    isValidToken(token: string) {
        try {
            this.checkToken(token);
            return true;
        } catch (err) {
            return false;
        }
    }
}