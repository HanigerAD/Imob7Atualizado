import { Builder } from 'builder-pattern';
import { environment } from 'src/environments/environment';
import { AgentResponse } from '../integration/response/agent.response';
import { AgentModel } from '../model/agent.model';

export class AgentMapper {

    private static cdnEndpoint: string = environment.endpoint.cdn;

    public static mapAgentsArrayResponseToModel(response: AgentResponse[]): AgentModel[] {
        return response.map(property => this.mapAgentResponseToModel(property));
    }

    public static mapAgentResponseToModel(response: AgentResponse): AgentModel {
        return Builder<AgentModel>()
            .code(response.code)
            .image(`${this.cdnEndpoint}${response.image}`)
            .name(response.name)
            .phone(response.phone)
            .flagVisivelSite(response.flagVisivelSite)
            .build();
    }
}
