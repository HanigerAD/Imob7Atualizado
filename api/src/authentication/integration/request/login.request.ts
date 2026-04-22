import { IsEmail, IsNotEmpty } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class LoginRequest {

    @IsEmail()
    @IsNotEmpty({message: 'Obrigatório informar o e-mail de login.'})
    public email: string;

    @IsNotEmpty({message: 'Obrigatório informar a senha para login.'})
    public password: string;
}
