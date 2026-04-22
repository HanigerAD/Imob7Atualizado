import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { QueryBuilder } from 'knex';

import { TransactionEnum } from '../../../common/enum/transaction.enum';
import { CategoryEntity } from '../../category/entity/category.entity';
import { ConservationStateEntity } from '../../conservation-state/entity/conservation-state.entity';
import { ProfileEntity } from '../../profile/entity/profile.entity';
import { TransactionEntity } from '../../transaction/entity/transaction.entity';
import { ZoneEntity } from '../../zone/entity/zone.entity';
import { PropertyDetailEntity } from '../entity/property-detail.entity';
import { PropertyImageEntity } from '../entity/property-image.entity';
import { PropertyEntity } from '../entity/property.entity';
import { AgentEntity } from './../../../agent/entity/agent.entity';
import { PropertyFilterEntity } from './../entity/property-filter.entity';
import { ImageSortRequest } from "../integration/request/image-sort.request";
import { PropertyDocumentEntity } from "../entity/property-document.entity";
import { LogEntity } from "../entity/log.entity";
import { SituationEntity } from "../../../user/entity/situation.entity";

@Injectable()
export class PropertyRepository {
  constructor(
    @InjectKnex() private readonly knex: Knex
  ) {
  }

  public insertProperty(entity: PropertyDetailEntity): Promise<number> {
    return this.knex
      .insert(entity)
      .into('imovel');
  }

  public basicQuery(filter: PropertyFilterEntity): Promise<any> {
    const neighborhood = filter.bairro;
    const price = filter.preco;

    delete filter.bairro;
    delete filter.paginacao;
    delete filter.preco;

    let query = this.knex
      .select('codigo')
      .from('imovel')
      .where(filter);

    if (price.minPrice && price.maxPrice) {
      query.whereBetween('valor', [price.minPrice, price.maxPrice])
    } else if (price.minPrice) {
      query.andWhere('valor', '>=', price.minPrice)
    } else if (price.maxPrice) {
      query.andWhere('valor', '<=', price.maxPrice)
    }

    if (neighborhood?.length > 0) {
      query = query.whereIn('bairro', neighborhood);
    }

    query.pluck('codigo');

    return query;
  }

  public getById(code: number): Promise<ProfileEntity> {
    return this.knex
      .select(
        'imovel.*',
        'area_total as areaTotal',
        'transacao_imovel.descricao as transacao',
        'transacao_imovel.codigo as transacao_codigo',
        'foto_imovel.foto as foto',
        'bairro.descricao as bairro',
        'municipio.descricao as municipio',
        'unidade_federativa.descricao as uf',
        'zona_imovel.descricao as zona',
        'categoria_imovel.descricao as categoria'
      )
      .from('imovel')
      .joinRaw('LEFT JOIN categoria_imovel ON imovel.categoria = categoria_imovel.codigo')
      .joinRaw('LEFT JOIN zona_imovel ON imovel.zona = zona_imovel.codigo')
      .joinRaw('INNER JOIN bairro as join_bairro ON join_bairro.codigo = imovel.bairro')
      .joinRaw('LEFT JOIN municipio as join_municipio ON join_municipio.codigo = join_bairro.municipio')
      .joinRaw('LEFT JOIN unidade_federativa as join_unidade_federativa ON join_unidade_federativa.codigo = join_municipio.unidade_federativa')
      .joinRaw('LEFT JOIN agenciador ON imovel.agenciador = agenciador.codigo')
      .joinRaw('LEFT JOIN transacao_imovel ON imovel.transacao = transacao_imovel.codigo')
      .joinRaw('LEFT JOIN foto_imovel ON imovel.codigo = foto_imovel.imovel')
      .where('codigo_interno', code)
      .first();
  }

  private getAllQueryBuilder(queryBuilder: QueryBuilder<unknown, any>, filters) {
    const filtersKeys = Object.keys(filters);

    let filtersList = filtersKeys.map(filterkey => ({ key: filterkey, value: filters[filterkey] }));
    filtersList = filtersList.filter(filter => filter.key !== 'paginacao');

    filtersList.forEach(({ key: filterKey, value: filterValue }) => {
      switch (filterKey) {
        case 'preco': {
          let { minPrice, maxPrice } = filterValue;
          const filterOfType = filtersList.find(({ key }) => key === 'tipo');

          if (filterOfType && filterOfType.value == 4) {
            queryBuilder.where('valor', '=', 0)
          } else {
            if (minPrice && maxPrice) {
              queryBuilder.whereBetween('valor', [minPrice, maxPrice])
            } else if (minPrice) {
              queryBuilder.andWhere('valor', '>=', minPrice)
            } else if (maxPrice) {
              queryBuilder.andWhere('valor', '<=', maxPrice)
            }
          }

          break;
        }

        case 'transacao': {
          queryBuilder.where('transacao_imovel.codigo', '=', filterValue);
          break;
        }

        case 'municipio': {
          queryBuilder.where('municipio.codigo', '=', filterValue);
          break;
        }

        case 'bairro': {
          // queryBuilder.where('bairro.codigo', '=', filterValue);
          if (filterValue[0] === '0') {
            queryBuilder.whereNotIn('bairro.codigo', filterValue);

          } else {

            queryBuilder.whereIn('bairro.codigo', filterValue);
          }
          break;
        }

        case 'agenciador': {
          queryBuilder.where('agenciador.codigo', '=', filterValue);
          break;
        }

        case 'categoria': {
          const category = String(filterValue).toUpperCase();

          if (category == 'RURAL') {
            queryBuilder.whereIn('categoria_imovel.codigo', [9, 10, 11]);
          } else {
            queryBuilder.where('categoria_imovel.codigo', '=', filterValue);
          }

          break;
        }

        case 'zona': {
          queryBuilder.where('zona_imovel.codigo', '=', filterValue)
          break;
        }

        default: {
          queryBuilder.where(`imovel.${filterKey}`, '=', filterValue);
          break;
        }
      }
    });

  }

  public getAll(filters: PropertyFilterEntity): Promise<PropertyEntity[]> {
    const since = (filters?.paginacao?.pagina - 1) * filters?.paginacao?.porPagina;
    const perPage = filters?.paginacao?.porPagina;

    return this.knex
      .select(
        'imovel.*',
        'area_total as areaTotal',
        'transacao_imovel.descricao as transacao',
        'transacao_imovel.codigo as transacao_codigo',
        'foto_imovel.foto as foto',
        'bairro.descricao as bairro',
        'municipio.descricao as municipio',
        'unidade_federativa.descricao as uf',
        'zona_imovel.descricao as zona',
        'categoria_imovel.descricao as categoria',
      )
      .from('imovel')
      .joinRaw('LEFT JOIN categoria_imovel ON imovel.categoria = categoria_imovel.codigo')
      .joinRaw('LEFT JOIN zona_imovel ON imovel.zona = zona_imovel.codigo')
      .joinRaw('INNER JOIN bairro ON bairro.codigo = imovel.bairro')
      .joinRaw('INNER JOIN municipio ON municipio.codigo = bairro.municipio')
      .joinRaw('INNER JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa')
      .joinRaw('LEFT JOIN agenciador ON imovel.agenciador = agenciador.codigo')
      .joinRaw('LEFT JOIN transacao_imovel ON imovel.transacao = transacao_imovel.codigo')
      .joinRaw('LEFT JOIN foto_imovel ON foto_imovel.codigo = (SELECT codigo FROM foto_imovel AS sub_foto_imovel WHERE sub_foto_imovel.imovel = imovel.codigo ORDER BY ordem LIMIT 1)')
      .modify(queryBuilder => this.getAllQueryBuilder(queryBuilder, filters))
      .offset(since)
      .limit(perPage)
      .orderBy('imovel.codigo', 'DESC');
  }

  public async getAllCounter(filters: PropertyFilterEntity): Promise<number> {
    const { total } = await this.knex
      .count('imovel.codigo as total')
      .from('imovel')
      .joinRaw('LEFT JOIN categoria_imovel ON imovel.categoria = categoria_imovel.codigo')
      .joinRaw('LEFT JOIN zona_imovel ON imovel.zona = zona_imovel.codigo')
      .joinRaw('INNER JOIN bairro ON bairro.codigo = imovel.bairro')
      .joinRaw('INNER JOIN municipio ON municipio.codigo = bairro.municipio')
      .joinRaw('INNER JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa')
      .joinRaw('LEFT JOIN transacao_imovel ON imovel.transacao = transacao_imovel.codigo')
      .joinRaw('LEFT JOIN foto_imovel ON foto_imovel.codigo = (SELECT codigo FROM foto_imovel AS sub_foto_imovel WHERE sub_foto_imovel.imovel = imovel.codigo ORDER BY ordem LIMIT 1)')
      .modify(queryBuilder => this.getAllQueryBuilder(queryBuilder, filters))
      .first();

    return total ? total : 0;
  }

  public getAllQuery(filter: PropertyFilterEntity): Promise<PropertyDetailEntity[]> {
    return this.knex
      .select('codigo')
      .from('imovel')
      .where(filter);
  }

  public getSingle(code: number): Promise<PropertyDetailEntity> {
    return this.knex
      .select()
      .from('imovel')
      .where('codigo', '=', code)
      .first();
  }

  public update(code: number, entity: PropertyDetailEntity): Promise<number> {
    return this.knex
      .update(entity)
      .from('imovel')
      .where('codigo', '=', code);
  }

  public getAgent(code: number): Promise<AgentEntity> {
    return this.knex
      .select('agenciador.*')
      .from('imovel')
      .joinRaw('JOIN agenciador ON agenciador.codigo = imovel.agenciador')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getCategory(code: number): Promise<CategoryEntity> {
    return this.knex
      .select('*')
      .from('categoria_imovel')
      .where('codigo', '=', code)
      .first();
  }

  public getCategoryByProperty(code: number): Promise<CategoryEntity> {
    return this.knex
      .select('categoria_imovel.*')
      .from('imovel')
      .joinRaw('JOIN categoria_imovel ON categoria_imovel.codigo = imovel.categoria')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public insertCategory(entity: CategoryEntity): Promise<number> {
    return this.knex
      .insert(entity)
      .into('categoria_imovel');
  }

  public updateCategory(code: number, entity: CategoryEntity): Promise<number> {
    return this.knex
      .update(entity)
      .from('categoria_imovel')
      .where('codigo', '=', code);
  }

  public deleteCategory(code: number): Promise<number> {
    return this.knex
      .delete()
      .from('categoria_imovel')
      .where('codigo', '=', code);
  }

  public getConservationState(code: number): Promise<ConservationStateEntity> {
    return this.knex
      .select('estado_conservacao.*')
      .from('imovel')
      .joinRaw('JOIN estado_conservacao ON estado_conservacao.codigo = imovel.estado_conservacao')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getprofile(code: number): Promise<ProfileEntity> {
    return this.knex
      .select('perfil_imovel.*')
      .from('imovel')
      .joinRaw('JOIN perfil_imovel ON perfil_imovel.codigo = imovel.perfil')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getZone(code: number): Promise<ZoneEntity> {
    return this.knex
      .select('zona_imovel.*')
      .from('imovel')
      .joinRaw('JOIN zona_imovel ON zona_imovel.codigo = imovel.zona')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getType(code: number): Promise<ZoneEntity> {
    return this.knex
      .select('tipo_imovel.*')
      .from('imovel')
      .joinRaw('JOIN tipo_imovel ON tipo_imovel.codigo = imovel.tipo')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getSituation(code: number): Promise<SituationEntity> {
    return this.knex
      .select('situacao.*')
      .from('imovel')
      .joinRaw('JOIN situacao ON situacao.codigo = imovel.situacao')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public getTransaction(code: number): Promise<TransactionEntity> {
    return this.knex
      .select('transacao_imovel.*')
      .from('imovel')
      .joinRaw('JOIN transacao_imovel ON transacao_imovel.codigo = imovel.transacao')
      .where('imovel.codigo', '=', code)
      .first();
  }

  public counterProperties(): Promise<number> {
    return this.knex
      .select()
      .from('imovel')
      .count('* as registers')
  }

  public getPropertyImage(code: number): Promise<PropertyImageEntity[]> {
    return this.knex
      .select('foto')
      .from('foto_imovel')
      .where('imovel', '=', code)
      .orderBy('ordem', 'asc');
  }

  public getPropertyImagesUrls(code: number): Promise<PropertyImageEntity[]> {
    return this.knex
      .select('foto')
      .from('foto_imovel')
      .where('imovel', '=', code)
      .orderBy('ordem', 'asc');
  }

  public getAllPropertiesImagesUrls(): Promise<PropertyImageEntity[]> {
    return this.knex
      .select('foto')
      .from('foto_imovel')
      .orderBy('ordem', 'asc');
  }

  public getPropertyDocuments(code: number): Promise<PropertyDocumentEntity[]> {
    return this.knex
      .select('*')
      .from('documento_imovel')
      .where('imovel', '=', code);
  }

  public insertPropertyImages(file: string, i: number, code: number): Promise<number[]> {
    return this.knex
      .insert({ foto: file, ordem: i + 1, imovel: code })
      .from('foto_imovel')
  }

  public insertPropertyImage(file: string, i: number, code: number): Promise<number> {
    return this.knex
      .insert({ foto: file, ordem: i, imovel: code })
      .from('foto_imovel');
  }

  public async delete(code: number): Promise<number> {
    return this.knex.transaction(
      (trx) => {
        return this.knex
          .delete()
          .from('foto_imovel')
          .where('imovel', code)
          .transacting(trx)
          .then(
            () => this.knex
              .delete()
              .from('documento_imovel')
              .where('imovel', code)
              .transacting(trx)
              .then(
                () => this.knex
                  .delete()
                  .from('imovel')
                  .where('codigo', code)
                  .transacting(trx)
              )
          )
          .catch(trx.rollback)
      }
    );

  }

  public deleteImage(path: string): Promise<number> {
    return this.knex
      .delete()
      .from('foto_imovel')
      .where('foto', path);
  }

  public deleteDocuments(path: string): Promise<number> {
    return this.knex
      .delete()
      .from('documento_imovel')
      .where('documento', path);
  }

  public getPropertyImages(propertyCode: number): Promise<PropertyImageEntity[]> {
    return this.knex
      .select(
        'foto',
        'ordem'
      )
      .from('foto_imovel')
      .where('imovel', '=', propertyCode)
  }

  public insertPropertyDocument(filename: string, originalName: string, propertyCode: number): Promise<number> {
    return this.knex
      .insert({ imovel: propertyCode, documento: filename, nome_arquivo: originalName })
      .into('documento_imovel');
  }

  public rentPropertyCounter(): Promise<number> {
    return this.knex
      .select()
      .from('imovel')
      .where('transacao', '=', TransactionEnum.RENT)
      .count('* as registers')
  }

  public sellPropertyCounter(): Promise<number> {
    return this.knex
      .select()
      .from('imovel')
      .where('transacao', '=', TransactionEnum.SELL)
      .count('* as registers')
  }

  public updateImagesSort(imageSort: ImageSortRequest): Promise<number> {
    return this.knex
      .update('ordem', imageSort.index)
      .from('foto_imovel')
      .where('foto', imageSort.path);
  }

  public insertLog(logEntity: LogEntity): Promise<number> {
    return this.knex
      .insert({
        data: logEntity.data,
        tipo_log: logEntity.tipo_log,
        nome_campo: logEntity.nome_campo,
        informacao_antiga: logEntity.informacao_antiga,
        nova_informacao: logEntity.nova_informacao,
        codigo_agenciador: logEntity.codigo_agenciador,
        codigo_imovel: logEntity.codigo_imovel
      })
      .into('log');
  }

  public getLogs(propertyCode: number): Promise<LogEntity[]> {
    return this.knex
      .select('log.*', 'usuario.nome as nome_agenciador')
      .from('log')
      .joinRaw('JOIN usuario ON usuario.codigo = log.codigo_agenciador')
      .where('codigo_imovel', Number(propertyCode))
      .orderBy('codigo', 'DESC');
  }

  public getValueLog(table: string, code: number): Promise<any> {

    if (table === 'agenciador') {
      return this.knex
        .select('nome')
        .from(table)
        .where('codigo', code);
    }

    return this.knex
      .select('descricao')
      .from(table)
      .where('codigo', code);
  }

  public async getAllForXml(): Promise<any[]> {
  return this.knex
    .select(
      'imovel.*',
      'area_total as areaTotal',
      'transacao_imovel.descricao as transacao',
      'categoria_imovel.descricao as categoria',
      'zona_imovel.descricao as zona',
      'unidade_federativa.descricao as uf',
      'municipio.descricao as municipio',
      'bairro.descricao as bairro',
      'tipo_imovel.descricao as tipo_descricao'
    )
    .from('imovel')
    .leftJoin('categoria_imovel', 'categoria_imovel.codigo', 'imovel.categoria')
    .leftJoin('zona_imovel', 'zona_imovel.codigo', 'imovel.zona')
    .leftJoin('bairro', 'bairro.codigo', 'imovel.bairro')
    .leftJoin('municipio', 'municipio.codigo', 'bairro.municipio')
    .leftJoin('unidade_federativa', 'unidade_federativa.codigo', 'municipio.unidade_federativa')
    .leftJoin('transacao_imovel', 'transacao_imovel.codigo', 'imovel.transacao')
    .leftJoin('tipo_imovel', 'tipo_imovel.codigo', 'imovel.tipo')
    .orderBy('imovel.codigo', 'DESC');
}

}
