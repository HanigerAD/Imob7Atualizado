import {InjectKnex, Knex} from "nestjs-knex";
import {PhoneEntity} from "../entity/phone.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class PhoneRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {}

    public getPhone(commercialEntityCode: number): Promise<PhoneEntity[]> {
        return this.knex
            .select()
            .from('telefone')
            .where('entidade_comercial', '=', commercialEntityCode)
    }

    public deletePhone(commercialEntityCode: number): Promise<number> {
        return this.knex
            .delete()
            .from('telefone')
            .where('entidade_comercial', '=', commercialEntityCode)
    }

    public insertPhone(entities: PhoneEntity[]): Promise<number[]> {
        return this.knex
            .insert(entities)
            .into('telefone');
    }
}
