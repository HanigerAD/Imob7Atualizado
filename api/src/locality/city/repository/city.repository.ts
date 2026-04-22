import {Injectable} from "@nestjs/common";
import {InjectKnex, Knex} from "nestjs-knex";
import { FederativeUnitEntity } from "src/locality/federative-unit/entity/federative-unit.entity";
import { NeighborhoodEntity } from "src/locality/neighborhood/entity/neighborhood.entity";
import {CityEntity} from "../entity/city.entity";

@Injectable()
export class CityRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insert(entity: CityEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('municipio');
    }

    public getAll(): Promise<CityEntity[]> {
        return this.knex
            .select('municipio.*', 'unidade_federativa.descricao as descricao_unidade_federativa')
            .from('municipio')
            .joinRaw('JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa');
    }

    public getSingle(code: number): Promise<CityEntity> {
        return this.knex
            .select('municipio.*', 'unidade_federativa.descricao as descricao_unidade_federativa')
            .from('municipio')
            .joinRaw('JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa')
            .where('municipio.codigo', '=', code)
            .first();
    }

    public update(code: number, entity: CityEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('municipio')
            .where('codigo', '=', code);
    }

    public getNeighborhoods(code: number): Promise<NeighborhoodEntity[]> {
        return this.knex
            .select()
            .from('bairro')
            .where('municipio', '=', code);
    }

    public getFederativeUnit(code: number): Promise<FederativeUnitEntity> {
        return this.knex
            .select('unidade_federativa.*')
            .from('municipio')
            .joinRaw('JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa')
            .where('municipio.codigo', '=', code)
            .first();
    }

    public getCityByNeighborhood(neighborhoodCode: number): Promise<CityEntity> {
        return this.knex
            .select('municipio.*')
            .from('bairro')
            .joinRaw('JOIN municipio ON municipio.codigo = bairro.municipio')
            .where('bairro.codigo', '=', neighborhoodCode)
            .first();
    }

    public delete(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('municipio')
            .where('codigo', '=', code);
    }
}
