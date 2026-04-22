import {PhoneEntity} from "../entity/phone.entity";
import {PhoneResponse} from "../integration/response/phone.response";
import {Builder} from "builder-pattern";
import {PhoneRequest} from "../integration/request/phone.request";

export class PhoneMapper {
    public static entityToResponse(entity: PhoneEntity): PhoneResponse {
        return Builder<PhoneResponse>()
            .code(entity.codigo)
            .number(entity.numero)
            .build()
    }

    public static entityListToResponse(entities: PhoneEntity[]): PhoneResponse[] {
        return entities.map(entity => this.entityToResponse(entity));
    }

    public static requestToEntity(request: PhoneRequest): PhoneEntity {
        return Builder<PhoneEntity>()
            .numero(request.number)
            .entidade_comercial(request.commercialEntity)
            .build();
    }

    public static requestListToEntity(requests: PhoneRequest[]): PhoneEntity[] {
        return requests.map(request => this.requestToEntity(request));
    }
}
