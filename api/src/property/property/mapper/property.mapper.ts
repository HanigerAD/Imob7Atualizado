import { Builder } from 'builder-pattern';

import { PropertyDetailEntity } from '../entity/property-detail.entity';
import { PropertyRequest } from '../integration/request/property.request';
import { PropertyDTO } from '../DTO/property.dto';
import { PropertyDetailResponse } from '../integration/response/property-detail.response';
import { PropertyResponse } from '../integration/response/property.response';
import { PropertyEntity } from '../entity/property.entity';

export class PropertyMapper {
  public static requestToEntity(request: PropertyRequest): PropertyDetailEntity {
    return Builder<PropertyDetailEntity>()
      .codigo_interno(request.internalCode)
      .descricao(request.description)
      .titulo(request.title)
      .agenciador(request.agent)
      .alugado(request.rented)
      .ano_construcao(request.constuctionYear)
      .area_privativa(request.privativeArea)
      .area_total(request.totalArea)
      .banheiro(request.bathroom)
      .categoria(request.category)
      .destaque(request.featured)
      .dormitorio(request.dormitory)
      .estado_conservacao(request.conservationState)
      .exibir(request.show)
      .financiavel(request.financeable)
      .hectare(request.hectare)
      .informacao_privada(request.privateInfo)
      .pavimento(request.pavement)
      .perfil(request.profile)
      .reservado(request.reserved)
      .suite(request.suite)
      .super_destaque(request.superFeatured)
      .tipo(request.type)
      .unidade_disponivel(request.unitAvailable)
      .vaga(request.parkingVacancy)
      .valor(request.price)
      .zona(request.zone)
      .valor_condominio(request.condominiumPrice)
      .exibir_valor(request.showValue)
      .transacao(request.transaction)
      .bairro(request.neighborhood)
      .cep(request.zipCode)
      .logradouro(request.street)
      .complemento(request.complement)
      .numero(request.number)
      .latitude(request.latitude)
      .longitude(request.longitude)
      .situacao(request.situation)
      .link_youtube(request.linkYoutube)
      .build();
  }

  public static entityDetailToDto(entity: PropertyDetailEntity): PropertyDTO {
    return Builder<PropertyDTO>()
      .code(entity.codigo)
      .internalCode(entity.codigo_interno)
      .show(entity.exibir)
      .title(entity.titulo)
      .price(entity.valor)
      .dormitory(entity.dormitorio)
      .unitAvailable(entity.unidade_disponivel)
      .bathroom(entity.banheiro)
      .parkingVacancy(entity.vaga)
      .privativeArea(entity.area_privativa)
      .totalArea(entity.area_total)
      .pavement(entity.pavimento)
      .financeable(entity.financiavel)
      .description(entity.descricao)
      .privateInfo(entity.informacao_privada)
      .reserved(entity.reservado)
      .hectare(entity.hectare)
      .constuctionYear(entity.ano_construcao)
      .featured(entity.destaque)
      .superFeatured(entity.super_destaque)
      .suite(entity.suite)
      .rented(entity.alugado)
      .condominiumPrice(entity.valor_condominio)
      .showValue(entity.exibir_valor)
      .zipCode(entity.cep)
      .street(entity.logradouro)
      .number(entity.numero)
      .complement(entity.complemento)
      .latitude(entity.latitude)
      .longitude(entity.longitude)
      .neighborhood(entity.bairro)
      .city(entity.municipio)
      .situation(entity.situacao)
      .linkYoutube(entity.link_youtube)
      .build()
  }

  public static entityDetailListToDto(entities: PropertyDetailEntity[]): PropertyDTO[] {
    return entities.map(entity => this.entityDetailToDto(entity));
  }

  public static dtoToDetailResponse(dto: PropertyDTO): PropertyDetailResponse {
    return Builder<PropertyDetailResponse>()
      .code(dto.code)
      .internalCode(dto.internalCode)
      .show(dto.show)
      .title(dto.title)
      .price(dto.price)
      .dormitory(dto.dormitory)
      .unitAvailable(dto.unitAvailable)
      .bathroom(dto.bathroom)
      .parkingVacancy(dto.parkingVacancy)
      .privativeArea(dto.privativeArea)
      .totalArea(dto.totalArea)
      .pavement(dto.pavement)
      .financeable(dto.financeable)
      .description(dto.description)
      .privateInfo(dto.privateInfo)
      .reserved(dto.reserved)
      .hectare(dto.hectare)
      .constuctionYear(dto.constuctionYear)
      .featured(dto.featured)
      .superFeatured(dto.superFeatured)
      .suite(dto.suite)
      .rented(dto.rented)
      .condominiumPrice(dto.condominiumPrice)
      .showValue(dto.showValue)
      .zipCode(dto.zipCode)
      .street(dto.street)
      .number(dto.number)
      .complement(dto.complement)
      .latitude(dto.latitude)
      .longitude(dto.longitude)
      .linkYoutube(dto.linkYoutube)
      .build();
  }

  public static entityToResponse(property: PropertyEntity): PropertyResponse {
    return Builder<PropertyResponse>()
      .code(property.codigo)
      .internalCode(property.codigo_interno)
      .photo(property.foto)
      .title(property.titulo)
      .price(property.valor)
      .transaction(property.transacao)
      .category(property.categoria)
      .bedroom(property.dormitorio)
      .parkingVacancy(property.vaga)
      .totalArea(property.areaTotal)
      .zone(property.zona)
      .uf(property.uf)
      .city(property.municipio)
      .neighborhood(property.bairro)
      .financeable(property.financiavel)
      .build()
  }

  public static entityListToResponse(dto: PropertyEntity[]): PropertyResponse[] {
    return dto.map(property => this.entityToResponse(property));
  }
}
