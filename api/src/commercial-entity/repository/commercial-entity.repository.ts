import {InjectKnex, Knex} from "nestjs-knex";
import {CommercialEntityEntity} from "../entity/commercial-entity.entity";
import {Injectable} from "@nestjs/common";

@Injectable()
export class CommercialEntityRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public getSingle(code: number): Promise<CommercialEntityEntity> {
        return this.knex
            .select()
            .from('entidade_comercial')
            .where('codigo', '=', code)
            .first();
    }

    public updateEmail(code: number, email: string): Promise<number> {
        return this.knex
            .update({email: email})
            .into('entidade_comercial')
            .where('codigo', '=', code);

    }
}
