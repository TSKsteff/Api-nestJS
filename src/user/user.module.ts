import { UseIdCheckMiddleware } from './../middlewares/user-id-check.middleware';
import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef} from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity/entity';

@Module({
    imports:[forwardRef(()=> AuthModule),
        TypeOrmModule.forFeature([UserEntity])
    ],
    controllers:[UserController],
    providers:[UserService],
    exports:[UserService]
})
export class UserModule implements NestModule{
   
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(UseIdCheckMiddleware).forRoutes({
            path: 'users/*',
            method: RequestMethod.ALL
        });
    }
} 