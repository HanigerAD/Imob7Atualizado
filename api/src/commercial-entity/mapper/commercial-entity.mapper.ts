import {CommercialEntityEntity} from "../entity/commercial-entity.entity";
import {CommercialEntityResponse} from "../integration/response/commercial-entity.response";
import {Builder} from "builder-pattern";

export class CommercialEntityMapper {
    public static entityToResponse(entity: CommercialEntityEntity): CommercialEntityResponse {
        return Builder<CommercialEntityResponse>()
            .code(entity.codigo)
            .email(entity.email)
            .name(entity.nome)
            .cnpj(entity.cnpj)
            .cpf(entity.cpf)
            .build();
    }
}
