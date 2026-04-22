import {ConfigurationSiteRequest} from "../integration/request/configuration-site.request";
import {ConfigurationSiteEntity} from "../entity/configuration-site.entity";
import {Builder} from "builder-pattern";
import {ConfigurationResponse} from "../integration/response/configuration.response";
import {PhoneResponse} from "../integration/response/phone.response";

export class ConfigurationSiteMapper {
    public static requestToEntity(request: ConfigurationSiteRequest): ConfigurationSiteEntity {
        return Builder<ConfigurationSiteEntity>()
            .titulo(request.title)
            .horario_abertura_semana(request.openingHour)
            .logo(request.logo)
            .texto_institucional(request.institutionalText)
            .resumo_texto_institucional(request.institutionalTextResume)
            .build();
    }

    public static entityToResponse(entity: ConfigurationSiteEntity): ConfigurationResponse {
        return Builder<ConfigurationResponse>()
            .code(entity.codigo)
            .logo(entity.logo)
            .title(entity.titulo)
            .institutionalText(entity.texto_institucional)
            .institutionalTextResume(entity.resumo_texto_institucional)
            .weekOpeningHour(entity.horario_abertura_semana)
            .weekClosingHour(entity.horario_fechamento_semana)
            .saturdayOpeningHour(entity.horario_abertura_sabado)
            .saturdayClosingHour(entity.horario_fechamento_sabado)
            .sundayOpeningHour(entity.horario_abertura_domingo)
            .sundayClosingHour(entity.horario_fechamento_domingo)
            .email(entity.email)
            .address(entity.endereco)
            .phone([this.phoneEntityToResponse(entity.telefone)])
        .build()
    }

    private static phoneEntityToResponse(phone: string): PhoneResponse {
        return Builder<PhoneResponse>()
            .code(null)
            .number(phone)
        .build();
    }
}
