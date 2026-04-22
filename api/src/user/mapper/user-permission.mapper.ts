import {UserPermissionEntity} from "../entity/user-permission.entity";
import {Builder} from "builder-pattern";

export class UserPermissionMapper {
    public static requestToEntity(permissions: number[], userCode: number): UserPermissionEntity[] {
        return permissions.map(permission =>
        Builder<UserPermissionEntity>()
            .usuario(userCode)
            .permissao(permission)
            .build()
        );
    }
}