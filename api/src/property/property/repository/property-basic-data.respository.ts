import {Injectable} from '@nestjs/common';
import {InjectKnex, Knex} from 'nestjs-knex';
import {TransactionEntity} from '../../transaction/entity/transaction.entity';
import {ZoneEntity} from '../../zone/entity/zone.entity';
import {CategoryEntity} from '../../category/entity/category.entity';
import {TypeEntity} from '../../type/entity/type.entity';
import {ConservationStateEntity} from '../../conservation-state/entity/conservation-state.entity';
import {SituationEntity} from '../../../user/entity/situation.entity';
import {ProfileResponse} from '../../profile/integration/response/profile.response';
import {ProfileEntity} from '../../profile/entity/profile.entity';

@Injectable()
export class PropertyBasicDataRespository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public getTransactions(): Promise<TransactionEntity[]> {
        return this.knex
            .select()
            .from('transacao_imovel')
    }

    public getZones(): Promise<ZoneEntity[]> {
        return this.knex
            .select()
            .from('zona_imovel')
    }

    public getCategories(): Promise<CategoryEntity[]> {
        return this.knex
            .select()
            .from('categoria_imovel')
    }

    public getTypes(): Promise<TypeEntity[]> {
        return this.knex
            .select()
            .from('tipo_imovel');
    }

    public getConservationStates(): Promise<ConservationStateEntity[]> {
        return this.knex
            .select()
            .from('estado_conservacao')
    }

    public getSituations(): Promise<SituationEntity[]> {
        return this.knex
            .select()
            .from('situacao')
    }

    public getProfiles(): Promise<ProfileEntity[]> {
        return this.knex
            .select()
            .from('perfil_imovel');
    }



}
