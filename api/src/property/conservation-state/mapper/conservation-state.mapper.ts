import { ConservationStateEntity } from '../entity/conservation-state.entity';
import {Builder} from "builder-pattern";
import {ConservationStateResponse} from "../integration/response/conservation-state.response";

export class ConservationStateMapper {
    public static entityToResponse(entity: ConservationStateEntity): ConservationStateResponse {
        return Builder<ConservationStateResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: ConservationStateEntity[]): ConservationStateResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
