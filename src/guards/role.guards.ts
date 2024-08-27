import { UserService } from './../user/user.service';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";

import { Reflector } from '@nestjs/core';
import { Roles_Key } from 'src/decorators/role.decorators';
import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate{

    constructor(
        private readonly reflector: Reflector
    ) { }

    async canActivate(context: ExecutionContext){
        
        const requeridRoles = this.reflector.getAllAndOverride<Role[]>(Roles_Key, [context.getHandler(), context.getClass()]);

        if(!requeridRoles){ return true;}

        const {user} = context.switchToHttp().getRequest();
        requeridRoles.filter(role => role === user.role)

        console.log({requeridRoles, user})
        
        return requeridRoles.length > 0;
    
    }
}