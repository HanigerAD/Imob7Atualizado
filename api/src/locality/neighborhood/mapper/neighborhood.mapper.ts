import { Builder } from 'builder-pattern';

import { NeighborhoodEntity } from '../entity/neighborhood.entity';
import { NeighborhoodRequest } from '../integration/request/neighborhood.request';
import { NeighborhoodResponse } from '../integration/response/neighborhood.response';

export class NeighborhoodMapper {
    public static requestToEntity(request: NeighborhoodRequest): NeighborhoodEntity {
        return Builder<NeighborhoodEntity>()
            .descricao(request.description)
            .municipio(request.city)
            .build()
    }

    public static entityToResponse(entity: NeighborhoodEntity): NeighborhoodResponse {
        return Builder<NeighborhoodResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .city(entity.municipio)
            .build();
    }

    public static entityListToResponse(entities: NeighborhoodEntity[]): NeighborhoodResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }

}
