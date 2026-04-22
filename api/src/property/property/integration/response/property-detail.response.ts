import { FederativeUnitResponse } from './../../../../locality/federative-unit/integration/response/federative-unit.response';
import { NeighborhoodResponse } from './../../../../locality/neighborhood/integration/response/neighborhood.response';
import { CityResponse } from './../../../../locality/city/integration/response/city.response';
import { TransactionResponse } from './../../../transaction/integration/response/transaction.response';
import { FinalityResponse } from './../../../finality/integration/response/finality.response';
import { SituationResponse } from './../../../../user/integration/response/situation.response';
import { AgentResponse } from './../../../../agent/integration/response/agent.response';
import { ZoneResponse } from './../../../zone/integration/response/zone.response';
import { ProfileResponse } from './../../../profile/integration/response/profile.response';
import { ConservationStateResponse } from './../../../conservation-state/integration/response/conservation-state.response';
import { TypeResponse } from './../../../type/integration/response/type.response';
import { CategoryResponse } from './../../../category/integration/response/category.response';

export class PropertyDetailResponse {
    public code?: number;//ok
    public internalCode?: number;//ok
    public title?: string;//ok
    public price?: string;//ok
    public dormitory?: number;//ok
    public unitAvailable?: number;//ok
    public bathroom?: number;//ok
    public parkingVacancy?: number;//ok
    public privativeArea?: string;//ok
    public totalArea?: string;//ok
    public pavement?: number;//ok
    public financeable?: number;//ok
    public description?: string;//ok
    public privateInfo?: string;//ok
    public show?: number;//ok
    public reserved?: number;//ok
    public hectare?: number;//ok
    public constuctionYear?: number;//ok
    public featured?: number;//ok
    public superFeatured?: number;//ok
    public suite?: number;//ok
    public rented?: number;//ok
    public condominiumPrice?: string;//ok
    public showValue?: number;//ok
    public city?: CityResponse;//ok
    public neighborhood?: NeighborhoodResponse;//ok
    public zipCode?: string;//OK
    public street?: string;//ok
    public number?: number;//ok
    public complement?: string;//ok
    public latitude?: string;//ok
    public longitude?: string;//ok
    public mainPhoto: string;
    public linkYoutube?: string;
    public category?: CategoryResponse;//ok
    public type?: TypeResponse;//ok
    public conservationState?: ConservationStateResponse;//ok
    public profile?: ProfileResponse;//ok
    public zone?: ZoneResponse;//ok
    public agent?: AgentResponse;//ok
    public situation?: SituationResponse;//ok
    public finality?: FinalityResponse;
    public transaction?: TransactionResponse;//ok
    public federativeUnit?: FederativeUnitResponse;
}
