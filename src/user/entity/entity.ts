import { User } from './../../decorators/user.decorators';
import { Length } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Role } from '../../enums/role.enum';

@Entity('users')
export class UserEntity{

    @PrimaryGeneratedColumn({
        unsigned: true
    })
    id?: number;

    @Column({
        length: 63
    })
    name: string;
    
    @Column({
        length: 127
    })
    password: string;
    
    @Column({
        length: 127,
        unique: true
    })
    email: string;

    @Column({
        type: "date",
        nullable: true
    })
    birthdAt: Date;

    @CreateDateColumn()
    creadeAt?: Date;
    
    @UpdateDateColumn()
    updateAt?: Date;
    
    @Column({
        default: Role.User,
        type: 'enum',
        enum: [1, 2],
    })
    role: number;

}