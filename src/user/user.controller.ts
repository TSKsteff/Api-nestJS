import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, UseGuards, UseInterceptors } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceotors";
import { ParamID } from "./../decorators/param-id.decorators";
import { Roles } from "src/decorators/role.decorators";
import { Role } from "src/enums/role.enum";
import { RoleGuard } from "src/guards/role.guards";
import { AuthGuards } from "src/guards/auth.gaurds";
import { SkipThrottle, Throttle } from "@nestjs/throttler";

@Roles(Role.Admin)
@UseGuards(AuthGuards, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController{

constructor(private readonly userService: UserService) {}

    
    @Post()
    async create(@Body() data: CreateUserDTO){
        return this.userService.create(data);
    }

    @SkipThrottle()
    @Get()
    async readList(){
        return this.userService.list();
    }

    
    @Get(':id')
    async readOne(@ParamID()  id: number){
        console.log(id);
        return this.userService.show(id);
    }

    @Throttle(20,60)
    @Put(':id')
    async update(@Body() data : UpdatePutUserDTO, @Param('id', ParseIntPipe)  id){
        return this.userService.update(id, data);
    }

    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @Param('id', ParseIntPipe)  id){
        return this.userService.updatePartial(id, data);
    }

  
    @Delete(':id')
    async delete(@Param('id', ParseIntPipe)  id){
        return this.userService.delete(id);
    }
}