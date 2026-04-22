import {UserEntity} from "../entity/user.entity";
import {UserResponse} from "../integration/response/user.response";
import {Builder} from "builder-pattern";

export class UserMapper {
    public static entityToResponse(entity: UserEntity): UserResponse {
        return Builder<UserResponse>()
            .code(entity.codigo)
            .name(entity.nome)
            .email(entity.email)
            .build()
    }
}