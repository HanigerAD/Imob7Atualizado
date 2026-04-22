import {SituationEntity} from "../entity/situation.entity";
import {SituationResponse} from "../integration/response/situation.response";
import {Builder} from "builder-pattern";

export class SituationMapper {
    public static entityToResponse(entity: SituationEntity): SituationResponse {
        return Builder<SituationResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: SituationEntity[]): SituationResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}