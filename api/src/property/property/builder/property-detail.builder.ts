import { AgentResponse } from './../../../agent/integration/response/agent.response';
import { PropertyDetailResponse } from './../integration/response/property-detail.response';
import { PropertyMapper } from '../mapper/property.mapper';
import { CategoryResponse } from "../../category/integration/response/category.response";
import { ConservationStateResponse } from "../../conservation-state/integration/response/conservation-state.response";
import { ProfileResponse } from "../../profile/integration/response/profile.response";
import { TypeResponse } from "../../type/integration/response/type.response";
import { ZoneResponse } from "../../zone/integration/response/zone.response";
import { TransactionResponse } from '../../transaction/integration/response/transaction.response';
import { CityResponse } from "src/locality/city/integration/response/city.response";
import { NeighborhoodResponse } from "src/locality/neighborhood/integration/response/neighborhood.response";
import { PropertyDTO } from "../DTO/property.dto";
import { FederativeUnitResponse } from 'src/locality/federative-unit/integration/response/federative-unit.response';
import {SituationResponse} from "../../../user/integration/response/situation.response";

export class PropertyDetailBuilder {
    public property: PropertyDetailResponse;

    constructor() {
        this.property = new PropertyDetailResponse();
    }

    public build(): PropertyDetailResponse {
        return this.property;
    }

    public setProperty(property: PropertyDTO): PropertyDetailBuilder {
        this.property = PropertyMapper.dtoToDetailResponse(property);
        return this;
    }

    public setAgent(agent: AgentResponse): PropertyDetailBuilder {
        this.property.agent = agent;
        return this;
    }

    public setCategory(category: CategoryResponse): PropertyDetailBuilder {
        this.property.category = category;
        return this;
    }

    public setConservationState(conservationState: ConservationStateResponse): PropertyDetailBuilder {
        this.property.conservationState = conservationState;
        return this;
    }

    public setProfile(profile: ProfileResponse): PropertyDetailBuilder {
        this.property.profile = profile;
        return this;
    }

    public setType(type: TypeResponse): PropertyDetailBuilder {
        this.property.type = type;
        return this;
    }

    public setZone(zone: ZoneResponse): PropertyDetailBuilder {
        this.property.zone = zone;
        return this;
    }

    public setSituation(situation: SituationResponse): PropertyDetailBuilder {
        this.property.situation = situation;
        return this;
    }

    public setTransaction(transaction: TransactionResponse): PropertyDetailBuilder {
        this.property.transaction = transaction;
        return this;
    }

    public setFederativeUnit(federativeUnit: FederativeUnitResponse): PropertyDetailBuilder {
        this.property.federativeUnit = federativeUnit;
        return this;
    }

    public setCity(city: CityResponse): PropertyDetailBuilder {
        this.property.city = city;
        return this;
    }

    public setNeighborhood(neighborhood: NeighborhoodResponse): PropertyDetailBuilder {
        this.property.neighborhood = neighborhood;
        return this;
    }


}
