import {UserResponse} from "../integration/response/user.response";
import {SituationResponse} from "../integration/response/situation.response";
import {PermissionResponse} from "../integration/response/permission.response";

export class UserBuilder {
    public user: UserResponse;

    constructor() {
        this.user = new UserResponse();
    }

    public static get(): UserResponse {
        return new UserResponse();
    }

    public build(): UserResponse {
        return this.user;
    }

    public userData(user: UserResponse): UserBuilder {
        this.user = user;
        return this;
    }

    public situation(situation: SituationResponse): UserBuilder {
        this.user.situation = situation;
        return this;
    }

    public permissions(permission: PermissionResponse[]): UserBuilder {
        this.user.permission = permission;
        return this;
    }
}
