import { UserModel } from './user.model';
import { ConfigurationModel } from './configuration.model';

export class LoginModel {
    public token: string;
    public user: UserModel;
    public configuration: ConfigurationModel;
}
