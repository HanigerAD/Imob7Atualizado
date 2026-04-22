import {Builder} from "builder-pattern";
import {ZoneEntity} from "../entity/zone.entity";
import {ZoneResponse} from "../integration/response/zone.response";

export class ZoneMapper {
    public static entityToResponse(entity: ZoneEntity): ZoneResponse {
        return Builder<ZoneResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: ZoneEntity[]): ZoneResponse[] {
        return entities.map(entity => this.entityToResponse(entity))
    }
}

