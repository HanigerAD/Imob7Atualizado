import {LogRequest} from "../integration/request/log.request";
import {LogEntity} from "../entity/log.entity";
import {Builder} from "builder-pattern";
import {LogResponse} from "../integration/response/log.response";

export class LogMapper {

    public static mapRequestToEntity(request: LogRequest): LogEntity {
        return Builder<LogEntity>()
            .data(request.date)
            .tipo_log(request.type)
            .nome_campo(request.field)
            .informacao_antiga(request.oldData)
            .nova_informacao(request.newData)
            .codigo_agenciador(request.agentCode)
            .codigo_imovel(request.propertyCode)
        .build();
    }

    public static mapRequestListToEntity(request: LogRequest[]): LogEntity[] {
        return request.map(log => this.mapRequestToEntity(log));
    }

    public static mapEntityToResponse(entity: LogEntity): LogResponse {
        return Builder<LogResponse>()
            .code(entity.codigo)
            .date(entity.data)
            .type(entity.tipo_log)
            .field(entity.nome_campo)
            .oldData(entity.informacao_antiga)
            .newData(entity.nova_informacao)
            .agentName(entity.nome_agenciador)
            .agentCode(entity.codigo_agenciador)
            .propertyCode(entity.codigo_imovel)
        .build();
    }

    public static mapEntityListToResponse(entity: LogEntity[]): LogResponse[] {
        return entity.map(log => this.mapEntityToResponse(log));
    }

}
