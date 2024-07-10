import { IsEmail, Length, length } from "class-validator";

export class CreateUserDto {

    @Length(5)
    username: string;
    @Length(5)
    password: string;
    @Length(5)
    retypePassword: string;
    @Length(2)
    firstName: string;
    @Length(2)
    lastName: string;
    @IsEmail()
    email: string;
}