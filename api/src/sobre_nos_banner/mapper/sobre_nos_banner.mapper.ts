import { SobreNosBannerEntity } from "../entity/sobre_nos_banner.entity";
import { SobreNosBannerResponse } from "../integration/response/sobre_nos_banner.response";
import { Builder } from "builder-pattern";

export class SobreNosBannerMapper {
  public static entityToResponse(entity: SobreNosBannerEntity): SobreNosBannerResponse {
    return Builder<SobreNosBannerResponse>()
      .code(entity.codigo)
      .image(entity.imagem)
      .build();
  }

  public static entityListToResponse(
    entities: SobreNosBannerEntity[]
  ): SobreNosBannerResponse[] {
    return entities.map((entity) => this.entityToResponse(entity));
  }
}

