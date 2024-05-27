import { UserService } from './../user/user.service';
import { Request } from 'express';
import { AuthService } from './../auth/auth.service';
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { request } from 'http';
import { Observable } from "rxjs";

@Injectable()
export class AuthGuards implements CanActivate{

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService
    ) { }

    async canActivate(context: ExecutionContext){
        
        const request = context.switchToHttp().getRequest();
        const {authorization} = request.headers;
        try {
            const data =  this.authService.checkToken((authorization ?? '').split(' ')[1]);
            request.tokenPayload = data;
            request.user = await this.userService.show(data.id);
            return true;
        } catch (error) {
            return false;
        }
    }
}