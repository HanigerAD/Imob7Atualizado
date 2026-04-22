import { UserResponse } from './user.response';
import { ConfigurationResponse } from './configuration.response';

export class LoginResponse {
    public token: string;
    public user: UserResponse;
    public configuration: ConfigurationResponse;
}
