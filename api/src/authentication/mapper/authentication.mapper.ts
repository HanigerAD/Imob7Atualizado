import {Builder} from "builder-pattern";
import {LoginRequest} from "../integration/request/login.request";
import {UserEntity} from '../../user/entity/user.entity';

export class AuthenticationMapper {
    public static requestToEntity(login: LoginRequest): UserEntity {
        return Builder<UserEntity>()
            .email(login.email)
            .senha(login.password)
            .build()
    }
}
