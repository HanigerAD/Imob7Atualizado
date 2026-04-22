import { CityEntity } from './../../city/entity/city.entity';
import { InjectKnex, Knex } from "nestjs-knex";
import { Injectable, Scope } from "@nestjs/common";
import { FederativeUnitEntity } from "../entity/federative-unit.entity";

@Injectable()
export class FederativeUnitRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public getAll(): Promise<FederativeUnitEntity[]> {
        return this.knex
            .select()
            .from('unidade_federativa');
    }

    public getSingle(code: number): Promise<FederativeUnitEntity> {
        return this.knex
            .select()
            .from('unidade_federativa')
            .where('codigo', '=', code)
            .first();
    }

    public getCities(code: number): Promise<CityEntity[]> {
        return this.knex
            .select()
            .from('municipio')
            .where('unidade_federativa', "=", code);
    }

    public getByCity(cityCode: number): Promise<FederativeUnitEntity> {
        return this.knex
            .select('unidade_federativa.*')
            .from('municipio')
            .joinRaw('JOIN unidade_federativa ON unidade_federativa.codigo = municipio.unidade_federativa')
            .where('municipio.codigo', '=', cityCode)
            .first();
    }
}
