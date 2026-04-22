import { ImageResponse } from './../integration/response/photo.response';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Builder } from 'builder-pattern';
import { Response } from 'express';

import { AgentResponse } from 'src/agent/integration/response/agent.response';
import { CityResponse } from 'src/locality/city/integration/response/city.response';

import { AgentMapper } from '../../../agent/mapper/agent.mapper';
import { ImageSizeEnum } from '../../../common/enum/image-size.enum';
import { ImageRequest } from '../../../common/integration/request/image.request';
import { DocumentService } from '../../../common/service/document.service';
import { ImageService } from '../../../common/service/image.service';
import { UtilsService } from '../../../common/utils/utils';
import { CityService } from '../../../locality/city/service/city.service';
import { FederativeUnitService } from '../../../locality/federative-unit/service/federative-unit.service';
import { NeighborhoodService } from '../../../locality/neighborhood/service/neighborhood.service';
import { CategoryResponse } from '../../category/integration/response/category.response';
import { CategoryMapper } from '../../category/mapper/category.mapper';
import { ConservationStateResponse } from '../../conservation-state/integration/response/conservation-state.response';
import { ProfileResponse } from '../../profile/integration/response/profile.response';
import { TransactionResponse } from '../../transaction/integration/response/transaction.response';
import { TypeResponse } from '../../type/integration/response/type.response';
import { ZoneResponse } from '../../zone/integration/response/zone.response';
import { ZoneMapper } from '../../zone/mapper/zone.mapper';
import { PropertyDetailBuilder } from '../builder/property-detail.builder';
import { PropertyDTO } from '../DTO/property.dto';
import { PropertyFilterRequest } from '../integration/request/property-filter.request';
import { PropertyRequest } from '../integration/request/property.request';
import { PropertyDetailResponse } from '../integration/response/property-detail.response';
import { PropertyFilterMapper } from '../mapper/property-filter.mapper';
import { PropertyMapper } from '../mapper/property.mapper';
import { PropertyRepository } from '../repository/property.repository';
import { NeighborhoodResponse } from './../../../locality/neighborhood/integration/response/neighborhood.response';
import { ConservationStateMapper } from './../../conservation-state/mapper/conservation-state.mapper';
import { ProfileMapper } from './../../profile/mapper/profile.mapper';
import { TransactionMapper } from './../../transaction/mapper/transaction.mapper';
import { TypeMapper } from './../../type/mapper/type.mapper';
import { ImageMapper } from './../mapper/image.mapper';
import { CdnService } from "../../../common/service/cdn.service";
import { ImageSortRequest } from "../integration/request/image-sort.request";
import { PropertyDocumentResponse } from "../integration/response/property-document.response";
import { PropertyDocumentMapper } from "../mapper/property-document.mapper";
import { LogEntity } from "../entity/log.entity";
import { LogRequest } from "../integration/request/log.request";
import { LogMapper } from "../mapper/log.mapper";
import { LogResponse } from "../integration/response/log.response";
import { TableFieldEnum } from "../table-field.enum";
import { SituationResponse } from "../../../user/integration/response/situation.response";
import { SituationMapper } from "../../../user/mapper/situation.mapper";
import { ConfigurationService } from 'src/configuration/service/configuration.service';
import { ImageWatermark } from 'src/common/integration/request/image-watermark';
import { CategoryRequest } from '../../../property/category/integration/response/category.request';
import { PropertyResponse } from '../integration/response/property.response';
import {
  safeString,
  maxLen,
  toInt,
  toFloat,
  toChar,
  toDateTime,
  cleanName,
  cleanCEP,
  cleanDescription
} from 'src/common/utils/xml-utils';




@Injectable()
export class PropertyService {
  constructor(
    private repository: PropertyRepository,
    private neighborhoodService: NeighborhoodService,
    private cityService: CityService,
    private federativeUnitService: FederativeUnitService,
    private imageService: ImageService,
    private documentService: DocumentService,
    private configurationService: ConfigurationService
  ) {
  }

   private clean(value: any): string {
    if (!value) return '';
    return String(value)
      .replace(/[\x00-\x1F\x7F]/g, '')   // remove caracteres ilegais (CTRL chars)
      .replace(/\uFFFD/g, '')           // remove "�"
      .trim();
  }

  public async insertProperty(request: PropertyRequest): Promise<number> {
    const { municipio, ...propertyDetailEntity } = PropertyMapper.requestToEntity(request);
    return this.repository.insertProperty(propertyDetailEntity);
  }

  public async insertCategory(request: CategoryRequest): Promise<number> {
    return this.repository.insertCategory(CategoryMapper.requestToEntity(request));
  }

  public updateCategory(code: number, request: CategoryRequest): Promise<number> {
    return this.repository.updateCategory(code, CategoryMapper.requestToEntity(request));
  }

  public async deleteCategory(code: number): Promise<number> {
    const properties = await this.getPropertiesByCategory(code);

    if ((properties && properties.length)) {
      const message = 'Não foi possivel deletar o registro pois o mesmo contem outros registros vinculados.';
      throw new BadRequestException({
        message,
        properties,
      }, message);
    } else {
      try {
        return this.repository.deleteCategory(code);
      } catch (error) {
        throw new ConflictException(error, 'Erro ao executar comando no banco de dados')
      }
    }
  }

  public async update(code: number, request: PropertyRequest): Promise<number> {
    const { municipio, ...propertyDetailEntity } = PropertyMapper.requestToEntity(request);

    return this.repository.update(code, propertyDetailEntity);
  }

  public getAllProperties(filter: PropertyFilterRequest): Promise<any> {
    const filters = PropertyFilterMapper.requestToEntity(filter);

    return this.repository.getAll(UtilsService.clearObject(filters))
      .then(properties => PropertyMapper.entityListToResponse(properties));
  }

  public getAllPropertiesCounter(filter: PropertyFilterRequest): Promise<any> {
    const filters = PropertyFilterMapper.requestToEntity(filter);

    return this.repository.getAllCounter(UtilsService.clearObject(filters));
  }

  public async generateImagesWithWatermark(res: Response): Promise<void> {
    // buscar todas as imagens originais das propriedades
    let allImagesOfPropertiesResponse = await this.repository.getAllPropertiesImagesUrls();
    let allImagesOfProperties = allImagesOfPropertiesResponse.map(
      ({ foto }) => ({
        foto,
        originalFoto: `original-${foto}`,
        originalFotoUrl: `${process.env.CDN_URL}/original-${foto}`,
      } as ImageWatermark)
    );
    // buscar logo
    const { logo: logoImageName } = await this.configurationService.get();
    const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;

    return this.imageService.applyWatermarkAndSubmitToCdn(allImagesOfProperties, logoUrl, res);
  }

  public getSingle(code: number): Promise<PropertyDetailResponse> {
    return this.repository.getSingle(code)
      .then(result => PropertyMapper.entityDetailToDto(result))
      .then(property => this.buildDetailedResponse(property));
  }

  public async buildDetailedResponse(property: PropertyDTO): Promise<PropertyDetailResponse> {
    const builder = new PropertyDetailBuilder();
    builder.setProperty(property);

    if (property.code) {
      builder.setAgent(await this.getAgent(property.code));
      builder.setCategory(await this.getCategoryByProperty(property.code));
      builder.setConservationState(await this.getConservationState(property.code));
      builder.setProfile(await this.getprofile(property.code));
      builder.setType(await this.getType(property.code));
      builder.setZone(await this.getZone(property.code));
      builder.setTransaction(await this.getTransaction(property.code))
    }

    if (property.neighborhood) {
      const neighborhood = await this.neighborhoodService.getSingle(property.neighborhood);
      builder.setNeighborhood(neighborhood)

      if (neighborhood && neighborhood.city) {
        const city = await this.cityService.getSingle(Number(neighborhood.city));
        builder.setCity(city)

        if (city && city.code) {
          builder.setFederativeUnit(await this.federativeUnitService.getByCity(city.code))
        }
      }
    }

    if (property.code) {
      builder.setSituation(await this.getSituation(property.code))
    }

    return builder.build();
  }

  public getCity(code: number): Promise<CityResponse> {
    return this.cityService.getSingle(code);
  }

  public getNeighborhood(code: number): Promise<NeighborhoodResponse> {
    return this.neighborhoodService.getSingle(code);
  }

  public getPropertiesByCategory(code: number): Promise<PropertyResponse[]> {
    return this.repository.getAll({ paginacao: { pagina: 1, porPagina: 1000 }, categoria: String(code) })
      .then(result => PropertyMapper.entityListToResponse(result));
  }

  public getCategory(code: number): Promise<CategoryResponse> {
    return this.repository.getCategory(code)
      .then(result => CategoryMapper.entityToResponse(result));
  }

  public getCategoryByProperty(code: number): Promise<CategoryResponse> {
    return this.repository.getCategoryByProperty(code)
      .then(result => CategoryMapper.entityToResponse(result));
  }

  public getAgent(code: number): Promise<AgentResponse> {
    return this.repository.getAgent(code)
      .then(result => AgentMapper.entityToResponse(result));
  }

  public getConservationState(code: number): Promise<ConservationStateResponse> {
    return this.repository.getConservationState(code)
      .then(result => ConservationStateMapper.entityToResponse(result));
  }

  public getprofile(code: number): Promise<ProfileResponse> {
    return this.repository.getprofile(code)
      .then(result => ProfileMapper.entityToResponse(result));
  }

  public getZone(code: number): Promise<ZoneResponse> {
    return this.repository.getZone(code)
      .then(result => ZoneMapper.entityToResponse(result));
  }

  public getType(code: number): Promise<TypeResponse> {
    return this.repository.getType(code)
      .then(result => TypeMapper.entityToResponse(result));
  }

  public getSituation(code: number): Promise<SituationResponse> {
    return this.repository.getSituation(code)
      .then(result => SituationMapper.entityToResponse(result));
  }

  public getTransaction(code: number): Promise<TransactionResponse> {
    return this.repository.getTransaction(code)
      .then(transaction => TransactionMapper.entityToResponse(transaction));
  }

  public getRentCounter(): Promise<number> {
    return this.repository.rentPropertyCounter()
      .then(result => result[0].registers);
  }

  public getSellCounter(): Promise<number> {
    return this.repository.sellPropertyCounter()
      .then(result => result[0].registers);
  }

  // public getPropertyImage(code: number): Promise<string[]> {
  //     return this.repository.getPropertyImage(code)
  //         .then(result => result.foto);
  // }

  public getPropertyImagesUrls(code: number): Promise<string[]> {
    return this.repository.getPropertyImagesUrls(code)
      .then(result => result?.map(entity => entity.foto));
  }

  public getPropertyDocuments(code: number): Promise<PropertyDocumentResponse[]> {
    return this.repository.getPropertyDocuments(code)
      .then(documents => documents.map(document => PropertyDocumentMapper.mapPropertyDocumentEntityToResponse(document)));
  }

  public async insertPropertyImages(files: Express.Multer.File[], propertyCode: number): Promise<boolean> {
    const { logo: logoImageName } = await this.configurationService.get();
    const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;

    await this.imageService.saveImages(this.buildPropertyImage(files), true, logoUrl, ImageSizeEnum.PROPERTY_KBYTES)
    await Promise.all(files.map((file, i) => this.repository.insertPropertyImages(file.filename, i, propertyCode)))

    return true;
  }

  public async insertPropertyImage(file: Express.Multer.File, propertyCode: number, order: number): Promise<boolean> {
    const { logo: logoImageName } = await this.configurationService.get();
    const logoUrl = `${process.env.CDN_URL}/${logoImageName}`;

    try {
      await this.imageService.saveImage(this.buildPropertyImageRequest(file), true, logoUrl, ImageSizeEnum.PROPERTY_KBYTES)
      await this.repository.insertPropertyImage(file.filename, order, propertyCode)
    } catch (error) {
      console.log('insertPropertyImage', { error })
      throw error;
    }

    return true;
  }

  public async updateImagesSort(imagesSort: ImageSortRequest[]): Promise<void> {
    await Promise.all(imagesSort.map(image => this.repository.updateImagesSort(image)));
  }

  public async insertPropertyDocument(file: Express.Multer.File, propertyCode: number): Promise<void> {
    const newFile = this.buildPropertyDocument(file);
    await this.documentService.saveDocument(newFile);
    await this.repository.insertPropertyDocument(newFile.filename, newFile.originalname, propertyCode);
  }

  public insertDocuments(files: Express.Multer.File[], propertyCode: number, res: Response): void {
    Promise.all(files.map(file => this.documentService.saveDocument(file)));
    Promise.all(files.map(file => this.repository.insertPropertyDocument(file.filename, file.originalname, propertyCode)));
  }

  public buildPropertyDocument(file: Express.Multer.File): Express.Multer.File {
    return file;
  }

  public buildPropertyImage(files: Express.Multer.File[]): ImageRequest[] {
    return files?.map(file =>
      Builder<ImageRequest>()
        .file(file)
        .width(ImageSizeEnum.PROPERTY_WIDTH)
        .height(ImageSizeEnum.PROPERTY_HEIGHT)
        .build()
    );
  }

  public buildPropertyImageRequest(file: Express.Multer.File): ImageRequest {
    return Builder<ImageRequest>()
      .file(file)
      .width(ImageSizeEnum.PROPERTY_WIDTH)
      .height(ImageSizeEnum.PROPERTY_HEIGHT)
      .build();
  }

  public getPropertyImages(propertyCode: number): Promise<ImageResponse[]> {
    return this.repository.getPropertyImages(propertyCode)
      .then(entities => ImageMapper.entityListToResponse(entities))
  }

  public async deleteImages(paths: string[]): Promise<void> {
    await Promise.all(paths.map(path => this.repository.deleteImage(path)));
  }

  public async deleteDocuments(paths: string[]): Promise<void> {
    await Promise.all(paths.map(path => this.repository.deleteDocuments(path)));
  }

  public delete(code: number): Promise<number> {
    return this.repository.delete(code);
  }

  public async insertLogs(logRequest: LogRequest[]): Promise<void> {
    const entity: LogEntity[] = LogMapper.mapRequestListToEntity(logRequest);
    await Promise.all(entity.map(log => this.repository.insertLog(log)));
  }

  public getLogs(propertyCode: number): Promise<LogResponse[]> {
    return this.repository.getLogs(propertyCode)
      .then(logs => LogMapper.mapEntityListToResponse(logs));
  }

  public getValueLog(field: string, value: number): Promise<any> {
    const table = TableFieldEnum[field];
    return this.repository.getValueLog(table, value)
      .then(response => response[0]);
  }

  public async getFeedXml(): Promise<string> {
  // AGORA SIM: SELECT ESPECIAL PARA O XML
  const properties = await this.repository.getAllForXml();

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<Document>\n<imoveis>\n`;

  for (const p of properties) {
    const images = await this.getPropertyImagesUrls(p.codigo);
    const lastUpdate = p.data_atualizacao ? new Date(p.data_atualizacao) : new Date();

    xml += `<imovel>
<referencia>${this.clean(p.codigo_interno ?? p.codigo)}</referencia>
<codigo_cliente>${this.clean(p.codigo_interno ?? p.codigo)}</codigo_cliente>
<link_cliente>https://www.imobiliaria7setembro.com.br/#/detalhes-imovel/${p.codigo}</link_cliente>
<titulo>${this.clean(p.titulo)}</titulo>

<transacao>${toChar(this.mapTransaction(p.transacao), 1)}</transacao>
<transacao2>${toChar(this.mapTransaction2(p.transacao), 1)}</transacao2>

<finalidade>${this.mapFinalidade(p.tipo_descricao)}</finalidade>
<finalidade2></finalidade2>

<destaque>${this.clean(p.exibir === 1 ? 1 : 0)}</destaque>

<tipo>${this.mapTipo(p.categoria, this.mapFinalidade(p.tipo_descricao))}</tipo>
<tipo2></tipo2>

<valor>${toFloat(this.mapValor(p))}</valor>
<valor_locacao>${toFloat(this.mapValorLocacao(p))}</valor_locacao>
<valor_iptu>${toFloat(p.valor_iptu)}</valor_iptu>
<valor_condominio>${toFloat(p.valor_condominio)}</valor_condominio>

<area_total>${this.clean(p.area_total)}</area_total>
<area_util>${this.clean(p.area_privativa)}</area_util>
<conservacao></conservacao>

<quartos>${toInt(p.dormitorio, 3)}</quartos>
<suites>${toInt(p.suite ?? 0, 2)}</suites>
<garagem>${toInt(p.vaga, 3)}</garagem>
<banheiro>${toInt(p.banheiro, 3)}</banheiro>

<closet></closet>
<salas></salas>
<despensa></despensa>
<bar></bar>
<cozinha></cozinha>
<quarto_empregada></quarto_empregada>
<escritorio></escritorio>
<area_servico></area_servico>
<lareira></lareira>
<varanda></varanda>
<lavanderia></lavanderia>

<aceita_pet></aceita_pet>

<estado>${toChar(p.uf, 2)}</estado>
<cidade>${this.clean(p.municipio)}</cidade>
<bairro>${this.cleanNeighborhood(p.bairro)}</bairro>
<cep>${maxLen(this.clean(p.cep), 9)}</cep>

<endereco>${maxLen(this.clean(p.logradouro), 200)}</endereco>
<numero>${maxLen(this.clean(p.numero), 10)}</numero>
<complemento>${maxLen(this.clean(p.complemento), 50)}</complemento>

<esconder_endereco_imovel>${this.clean(p.esconder_endereco_imovel ?? 0)}</esconder_endereco_imovel>

<descritivo><![CDATA[${maxLen(this.clean(p.descricao), 3000)}]]></descritivo>

<fotos_imovel>`;

    for (const img of images) {
      xml += `
  <foto>
    <url>${process.env.CDN_URL}/${this.clean(img)}</url>
    <data_atualizacao>${toDateTime(lastUpdate)}</data_atualizacao>
  </foto>`;
    }

    xml += `
</fotos_imovel>

<data_atualizacao>${toDateTime(lastUpdate)}</data_atualizacao>

<latitude>${this.clean(p.latitude)}</latitude>
<longitude>${this.clean(p.longitude)}</longitude>

<video></video>
<tour_360></tour_360>

<area_comum>
    <item></item>
</area_comum>
<area_privativa>
    <item></item>
</area_privativa>

<aceita_troca></aceita_troca>
<periodo_locacao></periodo_locacao>

</imovel>\n`;
  }

  xml += `</imoveis>\n</Document>`;
  return xml;
}

private mapFinalidade(value: string): string {
  if (!value) return '';

  const v = value.toLowerCase();

  if (v.includes('resid')) return 'RE';     // Residencial
  if (v.includes('comer')) return 'CO';     // Comercial
  if (v.includes('terr')) return 'RU';      // Terreno (Rural no portal)
  if (v.includes('empre')) return 'CO';     // Empreendimento = Comercial

  return '';
}

private mapTransaction(value: string): string {
  if (!value) return '';
  const v = value.toLowerCase();

  if (v.includes('venda')) return 'V';
  if (v.includes('aluguel') || v.includes('locação')) return 'L';
  if (v.includes('temporada')) return 'L'; // Portal não aceita T

  return '';
}

private mapTransaction2(value: string): string {
  if (!value) return '';
  const v = value.toLowerCase();

  if (v.includes('venda') && (v.includes('aluguel') || v.includes('locação'))) {
    return 'L';
  }

  return '';
}

private mapTipo(value: string, finalidade: string = ''): string {
  if (!value) return '';

  const v = value.toLowerCase();
  const f = finalidade.toUpperCase(); // RE ou CO

  // ----------------------------
  // RESIDENCIAL (RE)
  // ----------------------------
  if (f === 'RE') {
    if (v.includes('apart')) return 'Apartamento';
    if (v.includes('casa') || v.includes('sobr')) return 'Casa / Sobrado';
    if (v.includes('cond')) return 'Casa / Sobrado em Condomínio';
    if (v.includes('cob')) return 'Cobertura';
    if (v.includes('flat')) return 'Flat';
    if (v.includes('kit') || v.includes('stú') || v.includes('stu')) return 'Kitnet / Stúdio';
    if (v.includes('loft')) return 'Loft';
    if (v.includes('sítio') || v.includes('sitio') || v.includes('chác') || v.includes('chac')) return 'Sítio / Chácara';
    if (v.includes('terr')) return 'Terreno / Lote';
    if (v.includes('condomínio') && v.includes('terr')) return 'Terreno em Condomínio';
  }

  // ----------------------------
  // COMERCIAL (CO)
  // ----------------------------
  if (f === 'CO') {
    if (v.includes('casa') || v.includes('sobr')) return 'Casa / Sobrado Comercial';
    if (v.includes('sala') || v.includes('conj')) return 'Conj. Comercial / Sala';
    if (v.includes('fazenda')) return 'Fazenda';
    if (v.includes('galp') || v.includes('depósito') || v.includes('deposito')) return 'Galpão / Depósito';
    if (v.includes('gar')) return 'Garagem';
    if (v.includes('ponto')) return 'Ponto Comercial';
    if (v.includes('prédio') || v.includes('predio')) return 'Prédio';
    if (v.includes('terr')) return 'Terreno comercial';
  }

  return value;
}


private mapValor(p: any): string {
  const t = p.transacao?.toLowerCase() ?? '';

  if (t.includes('venda') && !t.includes('aluguel')) {
    return this.clean(p.valor);
  }

  if (t.includes('aluguel') || t.includes('locação') || t.includes('temporada')) {
    return this.clean(p.valor_locacao ?? p.valor);
  }

  return this.clean(p.valor);
}

private mapValorLocacao(p: any): string {
  const t = p.transacao?.toLowerCase() ?? '';

  // Se for locação OU temporada, usa valor_locacao
  if (t.includes('aluguel') || t.includes('locação') || t.includes('temporada')) {
    // Se existir valor específico para locação, usa
    if (p.valor_locacao && Number(p.valor_locacao) > 0) {
      return this.clean(p.valor_locacao);
    }

    // Se não existir, usa p.valor como fallback
    return this.clean(p.valor);
  }

  // Para imóveis de venda → campo deve ir vazio
  return '';
}


private cleanNeighborhood(value: string): string {
  if (!value) return '';
  return String(value)
    .split('-')[0]   // Remove tudo após " - "
    .split('(')[0]   // Remove tudo após "("
    .trim();
}

}
