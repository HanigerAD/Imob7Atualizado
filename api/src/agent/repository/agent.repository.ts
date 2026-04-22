import {InjectKnex, Knex} from "nestjs-knex";
import {Injectable} from "@nestjs/common";
import {AgentEntity} from "../entity/agent.entity";

@Injectable()
export class AgentRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public insert(entity: AgentEntity): Promise<number> {
        return this.knex
            .insert(entity)
            .into('agenciador');
    }

    public getAll(): Promise<AgentEntity[]> {
        return this.knex
            .select('*')
            .from('agenciador');
    }

    public getSingle(code: number): Promise<AgentEntity> {
        return this.knex
            .select('*')
            .from('agenciador')
            .where('codigo', '=', code)
            .first();
    }

    public update(code: number, entity: AgentEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('agenciador')
            .where('codigo', '=', code);
    }

    public setImage(code: number, image: string): Promise<number> {
        return this.knex
            .update({imagem: image})
            .from('agenciador')
            .where('codigo', '=', code);
    }

    public delete(code: number): Promise<number> {
        return this.knex
            .delete()
            .from('agenciador')
            .where('codigo', '=', code);
    }

}
