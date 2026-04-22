import {IsEmail, IsNotEmpty} from "class-validator";

export class UserRequest {

    @IsNotEmpty({message: 'obrigatorio informar o nome do usuario'})
    public name?: string;

    @IsEmail()
    @IsNotEmpty({message: 'obrigatorio informar o e-mail do usuario'})
    public email?: string;

    public password?: string;

    @IsNotEmpty({message: 'obrigatorio informar a situacao do usuario'})
    public situation?: number;

    @IsNotEmpty({message: 'obrigatorio informar as permissoes do usuario'})
    public permission?: number[];


}