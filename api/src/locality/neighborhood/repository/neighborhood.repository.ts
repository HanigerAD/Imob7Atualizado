import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';

import { NeighborhoodEntity } from '../entity/neighborhood.entity';
import { PaginationDTO } from './../../../common/dto/pagination.dto';

@Injectable()
export class NeighborhoodRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insert(entity: NeighborhoodEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('bairro');
    }

    public basicQuery(): Promise<any> {
        return this.knex
            .select('codigo')
            .from('bairro')
            .pluck('codigo');
    }

    public getAll(pagination: PaginationDTO, neighborhoods: number[]): Promise<NeighborhoodEntity[]> {
        const since = (pagination?.page - 1) * pagination?.perPage;

        return this.knex
            .select('bairro.codigo', 'bairro.descricao', 'municipio.descricao as municipio')
            .from('bairro')
            .joinRaw('JOIN municipio ON bairro.municipio = municipio.codigo')
            .whereIn('bairro.codigo', neighborhoods)
            .orderBy('municipio.codigo')
            .offset(since)
            .limit(pagination.perPage);
    }

    public getSingle(code: number): Promise<NeighborhoodEntity> {
        return this.knex
            .select()
            .from('bairro')
            .where('codigo', '=', code)
            .first();
    }


    public update(code: number, entity: NeighborhoodEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('bairro')
            .where('codigo', '=', code);
    }

    public getNeighborhoodByAddress(addressCode: number): Promise<NeighborhoodEntity> {
        return this.knex
            .select('bairro.*')
            .from('endereco')
            .joinRaw('JOIN bairro ON bairro.codigo = endereco.bairro')
            .where('endereco.codigo', '=', addressCode)
            .first();
    }

    public delete(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('bairro')
            .where('codigo', '=', code);
    }
}
