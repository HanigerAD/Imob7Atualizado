import { ProfileMapper } from './../../profile/mapper/profile.mapper';
import { ConservationStateMapper } from './../../conservation-state/mapper/conservation-state.mapper';
import { TypeMapper } from './../../type/mapper/type.mapper';
import { TransactionMapper } from './../../transaction/mapper/transaction.mapper';
import {Injectable} from '@nestjs/common';
import {PropertyBasicDataRespository} from '../repository/property-basic-data.respository';
import {TransactionResponse} from '../../transaction/integration/response/transaction.response';
import {ZoneResponse} from '../../zone/integration/response/zone.response';
import {ZoneMapper} from '../../zone/mapper/zone.mapper';
import {TypeResponse} from '../../type/integration/response/type.response';
import {ConservationStateResponse} from '../../conservation-state/integration/response/conservation-state.response';
import {SituationResponse} from '../../../user/integration/response/situation.response';
import {SituationMapper} from '../../../user/mapper/situation.mapper';
import {ProfileResponse} from '../../profile/integration/response/profile.response';
import { CategoryMapper } from 'src/property/category/mapper/category.mapper';

@Injectable()
export class PropertyBasicDataService {
    constructor(
        private repository: PropertyBasicDataRespository
    ) {
    }

    public getTransactions(): Promise<TransactionResponse[]> {
        return this.repository.getTransactions()
            .then(transactions => TransactionMapper.entityListToResponse(transactions));
    }

    public getZones(): Promise<ZoneResponse[]> {
        return this.repository.getZones()
            .then(zones => ZoneMapper.entityListToResponse(zones));
    }

    public getCategories(): Promise<ZoneResponse[]> {
        return this.repository.getCategories()
            .then(categories => CategoryMapper.entityListToResponse(categories))
    }

    public getTypes(): Promise<TypeResponse[]> {
        return this.repository.getTypes()
            .then(types => TypeMapper.entityListToResponse(types));
    }

    public getConservationStates(): Promise<ConservationStateResponse[]> {
        return this.repository.getConservationStates()
            .then(conservationStates => ConservationStateMapper.entityListToResponse(conservationStates));
    }

    public getSituations(): Promise<SituationResponse[]> {
        return this.repository.getSituations()
            .then(situations => SituationMapper.entityListToResponse(situations))
    }

    public getProfiles(): Promise<ProfileResponse[]> {
        return this.repository.getProfiles()
            .then(profiles => ProfileMapper.entityListToResponse(profiles))
    }


}
