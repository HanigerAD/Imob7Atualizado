import { TypeEntity } from '../entity/type.entity';
import { Builder } from "builder-pattern";
import { TypeResponse } from "../integration/response/type.response";

export class TypeMapper {
    public static entityToResponse(entity: TypeEntity): TypeResponse {
        return Builder<TypeResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: TypeEntity[]): TypeResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
