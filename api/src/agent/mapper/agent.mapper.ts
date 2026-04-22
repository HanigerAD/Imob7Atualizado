import { AgentEntity } from "../entity/agent.entity";
import { Builder } from "builder-pattern";
import { AgentRequest } from "../integration/request/agent.request";
import { AgentResponse } from "../integration/response/agent.response";

export class AgentMapper {
  public static requestToEntity(request: AgentRequest): AgentEntity {
    return Builder<AgentEntity>()
      .nome(request.name)
      .telefone(request.phone)
      .flag_visivel_site(request.flagVisivelSite)
      .build();
  }

  public static entityToResponse(entity: AgentEntity): AgentResponse {
    return Builder<AgentResponse>()
      .code(entity.codigo)
      .name(entity.nome)
      .phone(entity.telefone)
      .image(entity.imagem)
      .flagVisivelSite(entity.flag_visivel_site)
      .build();
  }

  public static entityListToResponse(entities: AgentEntity[]): AgentResponse[] {
    return entities.map((entity) => this.entityToResponse(entity));
  }
}
