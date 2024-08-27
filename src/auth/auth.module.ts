import { AuthService } from './auth.service';
import { UserModule } from './../user/user.module';
import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { FileModule } from 'src/file/file.modules';
import { UserEntity } from 'src/user/entity/entity';
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    imports: [JwtModule.register({
        secret: String(process.env.JWT_SECRET_KEY)
    }), forwardRef(()=> UserModule),
    TypeOrmModule.forFeature([UserEntity]),
    FileModule],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService, TypeOrmModule]
})
export class AuthModule {

}