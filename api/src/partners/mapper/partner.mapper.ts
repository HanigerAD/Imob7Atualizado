import { PartnerEntity } from "../entity/partner.entity";
import { Builder } from "builder-pattern";
import { PartnerRequest } from "../integration/request/partner.request";
import { PartnerResponse } from "../integration/response/partner.response";

export class PartnerMapper {
  public static requestToEntity(request: PartnerRequest): PartnerEntity {
    return Builder<PartnerEntity>().nome(request.name).build();
  }

  public static entityToResponse(entity: PartnerEntity): PartnerResponse {
    return Builder<PartnerResponse>()
      .code(entity.codigo)
      .name(entity.nome)
      .image(entity.imagem)
      .build();
  }

  public static entityListToResponse(
    entities: PartnerEntity[]
  ): PartnerResponse[] {
    return entities.map((entity) => this.entityToResponse(entity));
  }
}
