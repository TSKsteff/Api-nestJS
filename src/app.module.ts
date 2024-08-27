import { forwardRef } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user/entity/entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ThrottlerModule.forRoot({
      ttl:60,
      limit:10,
      ignoreUserAgents: [/googlebot/gi]
    }),
     forwardRef(()=>UserModule),
     forwardRef(()=>AuthModule),
     
     MailerModule.forRoot({
        transport: {
          host: 'smtp.ethereal.email',
          port: 587,
          auth: {
            user: 'herminio.rohan@ethereal.email',
            pass: 'QkkcbkMRvmbY1NMezJ'
          }
        },
        defaults: {
          from: '"nest-modules" <herminio.rohan@ethereal>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          }
        }
     }),
     TypeOrmModule.forRoot({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [UserEntity],
        synchronize: process.env.ENV === 'development'
     })
    ],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
  exports: [AppService]
})
export class AppModule {}
