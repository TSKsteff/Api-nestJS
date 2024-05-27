import { AuthService } from './auth.service';
import { PrismaModule } from './../prisma/prisma.module';
import { UserModule } from './../user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { FileModule } from 'src/file/file.modules';


@Module({
    imports: [JwtModule.register({
        secret: process.env.JWT_SECRET_KEY
    }), forwardRef(()=> UserModule), PrismaModule, FileModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule {

}