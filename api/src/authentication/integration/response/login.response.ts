import {ConfigurationResponse} from '../../../configuration/integration/response/configuration.response';
import {UserResponse} from '../../../user/integration/response/user.response';

export class LoginResponse {
    public token: string;
    public user: UserResponse;
    public configuration: ConfigurationResponse;
}
