import { CityRequest } from "../integration/request/city.request";
import { CityEntity } from "../entity/city.entity";
import { Builder } from "builder-pattern";
import { CityResponse } from "../integration/response/city.response";
import {FederativeUnitResponse} from "../../federative-unit/integration/response/federative-unit.response";

export class CityMapper {
    public static requestToEntity(request: CityRequest): CityEntity {
        return Builder<CityEntity>()
            .descricao(request.description)
            .unidade_federativa(request.uf)
            .build()
    }

    public static entityToResponse(entity: CityEntity): CityResponse {
        return Builder<CityResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .uf(
                Builder<FederativeUnitResponse>()
                    .code(entity.unidade_federativa)
                    .description(entity.descricao_unidade_federativa)
                .build()
            )
        .build();
    }

    public static entityListToResponse(entities: CityEntity[]): CityResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
