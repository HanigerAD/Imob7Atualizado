import { Builder } from "builder-pattern";

import { FederativeUnitEntity } from "../entity/federative-unit.entity";
import { FederativeUnitResponse } from "../integration/response/federative-unit.response";


export class FederativeUnitMapper {
    public static entityToResponse(entity: FederativeUnitEntity): FederativeUnitResponse {
        return Builder<FederativeUnitResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: FederativeUnitEntity[]): FederativeUnitResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}