import {PermissionEntity} from "../entity/permission.entity";
import {PermissionResponse} from "../integration/response/permission.response";
import {Builder} from "builder-pattern";

export class PermissionMapper {
    public static entityToResponse(entity: PermissionEntity): PermissionResponse {
        return Builder<PermissionResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: PermissionEntity[]): PermissionResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}