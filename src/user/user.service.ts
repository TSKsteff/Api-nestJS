import { Role } from './../enums/role.enum';
import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import * as bcrypt from "bcrypt";
import { Repository } from 'typeorm';
import { UserEntity } from './entity/entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){}

    async create(data: CreateUserDTO){
        
        if((await this.userRepository.exists({
            where: {
                email: data.email
            }
        }))){
            throw new BadRequestException('O usuario com esse e-mail já existe.');
        }

        data.password =  await bcrypt.hash(data.password, await bcrypt.genSalt());
        
        const user =  this.userRepository.create(data);
        
        return this.userRepository.save(user);
    }
    
    async list(){
     return this.userRepository.find();
    }


    async update(id: number, {name,email,password, birthdAt, role}: UpdatePutUserDTO){
    
        await this.exists(id);

        password =  await bcrypt.hash(password, await bcrypt.genSalt());

        await  this.userRepository.update(id,{name,email,password, birthdAt: birthdAt ? new Date(birthdAt) : null, role});

        return this.show(id);
    }

    async updatePartial(id: number, {name,email,password, birthdAt, role}: UpdatePatchUserDTO){
        
        await this.exists(id);

        const data: any={};

        if(birthdAt){
            data.birthAt = new Date(birthdAt);
        }
        if(name){
            data.nome = name;
        }
        if(email){
            data.email = email;
        }
        if(password){
            data.password =  await bcrypt.hash(data.password, await bcrypt.genSalt());
        }
        if(role){
            data.role = role;
        }
        await  this.userRepository.update(id,data);
        return this.show(id);
    }

    async delete(id: number){
       await this.exists(id);
        return this.userRepository.delete({id});
    }
    
    async show(id: number){
        await this.exists(id);
        return  this.userRepository.findOneBy({id});
    }
    async exists(id: number){
        if(!(await this.userRepository.exists({
            where: {
                id
            }
        }))){
            throw new NotFoundException('O usuario com esse id não existe.');
        }
    }
}