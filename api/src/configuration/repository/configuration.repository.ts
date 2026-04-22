import {InjectKnex, Knex} from "nestjs-knex";
import {Injectable} from "@nestjs/common";
import {ConfigurationSiteEntity} from "../entity/configuration-site.entity";
import {CommercialEntityEnum} from "../../common/enum/commercial-entity.enum";

@Injectable()
export class ConfigurationRepository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public update(entity: ConfigurationSiteEntity): Promise<number> {
        return this.knex
            .update(entity)
            .from('configuracao_site')
            .where('codigo', '=', 1);
    }

    public get(): Promise<ConfigurationSiteEntity> {
        return this.knex
            .select()
            .from('configuracao_site')
            .where('codigo', '=', 1)
            .first();
    }

    public updateLogo(filename: string): Promise<number> {
        return this.knex
            .update({logo: filename})
            .from('configuracao_site')
            .where('codigo', '=', CommercialEntityEnum.REAL_STATE)
    }


}
