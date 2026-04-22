import {UserRequest} from "../integration/request/user.request";
import {UserEntity} from "../entity/user.entity";
import {Builder} from "builder-pattern";
import {UserResponse} from "../integration/response/user.response";
import {UtilsService} from "../../common/utils/utils";

export class UserMapper {

    public static requestToEntity(request: UserRequest): UserEntity {
        return Builder<UserEntity>()
            .nome(request.name)
            .email(request.email)
            .senha(request.password)
            .situacao(request.situation)
            .build()
    }

    public static entityToResponse(entity: UserEntity): UserResponse {
        return Builder<UserResponse>()
            .code(entity.codigo)
            .email(entity.email)
            .name(entity.nome)
            .build();
    }

    public static entityListToResponse(entities: UserEntity[]): UserResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }

    public static dtoToEntity(dto: UserRequest): UserEntity {
        const object = Builder<UserEntity>()
            .nome(dto.name)
            .email(dto.email)
            .situacao(dto.situation)
            .build();
        return UtilsService.clearObject(object);
    }

}
