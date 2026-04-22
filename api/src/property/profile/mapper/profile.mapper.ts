import { ProfileEntity } from '../entity/profile.entity';
import { ProfileResponse } from './../integration/response/profile.response';
import {Builder} from "builder-pattern";

export class ProfileMapper {
    public static entityToResponse(entity: ProfileEntity): ProfileResponse {
        return Builder<ProfileResponse>()
            .code(entity.codigo)
            .description(entity.descricao)
            .build();
    }

    public static entityListToResponse(entities: ProfileEntity[]): ProfileResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }
}
