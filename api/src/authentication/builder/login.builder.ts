import {ConfigurationResponse} from '../../configuration/integration/response/configuration.response';
import {LoginResponse} from '../integration/response/login.response';
import {UserResponse} from '../../user/integration/response/user.response';
import {PermissionResponse} from "../../user/integration/response/permission.response";

export class LoginBuilder {
    public login: LoginResponse;

    constructor() {
        this.login = new LoginResponse();
    }

    public build(): LoginResponse {
        return this.login;
    }

    public setToken(token: string): LoginBuilder {
        this.login.token = token;
        return this;
    }

    public setUser(user: UserResponse): LoginBuilder {
        this.login.user = user;
        return this;
    }

    public setPermissions(permissions: PermissionResponse[]): LoginBuilder {
        this.login.user.permission = permissions;
        return this;
    }

    public setConfiguration(configuration: ConfigurationResponse): LoginBuilder {
        this.login.configuration = configuration;
        return this;
    }

    public getCode(): number {
        return this.login.user.code;
    }
}
