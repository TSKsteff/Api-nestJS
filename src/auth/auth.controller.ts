import { FileService } from './../file/file.services';
import { AuthService } from './auth.service';
import { UserService } from './../user/user.service';
import { AuthResetDTO } from './dto/auth-reset.dto';
import { AuthforgetDTO } from './dto/auth-forget.dto';
import { AuthLoginDTO } from './dto/auth-login.dto';
import { Body, Controller, Headers, Post, UseGuards,Req, UseInterceptors, UploadedFile, BadRequestException, UploadedFiles, ParseFilePipe, FileTypeValidator, MaxFileSizeValidator } from "@nestjs/common";
import { AuthRegisterDTO } from './dto/auth-register.dto';
import { AuthGuards } from '../guards/auth.gaurds';
import { User } from 'src/decorators/user.decorators';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { writeFile } from 'fs/promises';
import { join } from 'path';


@Controller('auth')
export class AuthController{
 
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
        private readonly fileService: FileService){}

    @Post('login')
    async login(@Body() body: AuthLoginDTO){
        return this.authService.login(body.email, body.password);
    }

    @Post('register')
    async register(@Body() body: AuthRegisterDTO){
        return this.authService.register(body);
    }

    @Post('forget')
    async forget(@Body() body: AuthforgetDTO){
        return this.authService.forget(body.email);
    }

    @Post('reset')
    async reset(@Body() body: AuthResetDTO){
        return this.authService.reset(body.password, body.token);
    }

    @UseGuards(AuthGuards)  
    @Post('me')
    async me(@User() user) {
        
        return {user};
    }

    @UseInterceptors(FileInterceptor('file'))
    @UseGuards(AuthGuards)  
    @Post('photo')
    async uploadPhoto(@User() user, @UploadedFile(new ParseFilePipe({
        validators:[
            new FileTypeValidator({fileType: 'image/jpeg',}),
            new MaxFileSizeValidator({maxSize: 1024 * 999})
        ]
    })) photo: Express.Multer.File) {

        const path = join(__dirname,'..', '..', 'storage', 'photos', `photo-${user.id}.png`);
        try{
            await this.fileService.upload(photo, path);
        }catch(e){
               throw new BadRequestException(e.message);
        }
        

        return {sucess:true};
    }
    
    @UseInterceptors(FilesInterceptor('files'))
    @UseGuards(AuthGuards)  
    @Post('files')
    async uploadFiles(@User() user, @UploadedFiles() files: Express.Multer.File[]) {

        return files;
    }

    @UseInterceptors(FileFieldsInterceptor([{
        name: 'photo',
        maxCount: 1
    },{
        name: 'documents',
        maxCount: 10
    }]))
    @UseGuards(AuthGuards)  
    @Post('files-fields')
    async uploadFilesFields(@User() user, @UploadedFiles() files: {photo: Express.Multer.File, documents: Express.Multer.File[]}) {

        return files;
    }
}
