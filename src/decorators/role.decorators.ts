import { SetMetadata } from '@nestjs/common';
import { Role } from './../enums/role.enum';

export const Roles_Key = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(Roles_Key, roles);