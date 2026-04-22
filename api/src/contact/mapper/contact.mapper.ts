import {NewPropertyEntity} from "../entity/new-property.entity";
import {Builder} from "builder-pattern";
import {DateTime} from "luxon";
import {NewPropertyRequest} from "../integration/request/new-property.request";
import {NewPropertyResponse} from "../integration/response/new-property.response";
import {MessageResponse} from "../integration/response/message.response";
import {MessageEntity} from "../entity/message.entity";
import {MessageRequest} from "../integration/request/message.request";

export class ContactMapper {
    public static newPropertyContactRequestToEntity(request: NewPropertyRequest): NewPropertyEntity {
        return Builder<NewPropertyEntity>()
            .nome_completo(request.fullname)
            .email(request.email)
            .telefone(request.phone)
            .endereco(request.address)
            .uf(request.uf)
            .cidade(request.city)
            .bairro(request.neighborhood)
            .tipo(request.type)
            .area_privativa(request.privativeArea)
            .area_total(request.totalArea)
            .vagas(request.parking)
            .quartos(request.bedrooms)
            .condominio(request.condominium)
            .iptu(request.iptu)
            .finalidadde(request.finality)
            .imovel_pago(request.paidout)
            .preco(request.price)
            .descricao(request.description)
            .data(request.date)
        .build()
    }

    public static newPropertyContactEntityToResponse(entity: NewPropertyEntity): NewPropertyResponse {
        return Builder<NewPropertyResponse>()
            .code(entity.codigo)
            .fullname(entity.nome_completo)
            .email(entity.email)
            .phone(entity.telefone)
            .address(entity.endereco)
            .uf(entity.uf)
            .city(entity.cidade)
            .neighborhood(entity.bairro)
            .type(entity.tipo)
            .privativeArea(entity.area_privativa)
            .totalArea(entity.area_total)
            .parking(entity.vagas)
            .bedrooms(entity.quartos)
            .condominium(entity.condominio)
            .iptu(entity.iptu)
            .finality(entity.finalidadde)
            .paidout(entity.imovel_pago)
            .price(entity.preco)
            .description(entity.descricao)
            .date(entity.data)
        .build();
    }

    public static newPropertyContactEntityListToResponse(entities: NewPropertyEntity[]): NewPropertyResponse[] {
        return entities.map(entity => this.newPropertyContactEntityToResponse(entity));
    }

    public static messageContactRequestToEntity(request: MessageRequest): MessageEntity {
        return Builder<MessageEntity>()
            .nome_completo(request.fullname)
            .email(request.email)
            .telefone(request.phone)
            .assunto(request.subject)
            .mensagem(request.message)
        .build()
    }

    public static messageContactEntityToResponse(entity: MessageEntity): MessageResponse {
        return Builder<MessageResponse>()
            .code(entity.codigo)
            .fullname(entity.nome_completo)
            .email(entity.email)
            .phone(entity.telefone)
            .subject(entity.assunto)
            .message(entity.mensagem)
        .build();
    }

    public static messageEntityListToResponse(entities: NewPropertyEntity[]): MessageResponse[] {
        return entities.map(entity => this.messageContactEntityToResponse(entity));
    }
}
