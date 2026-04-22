import { CityMapper } from './../../city/mapper/city.mapper';
import { CityResponse } from './../../city/integration/response/city.response';
import { FederativeUnitRepository } from "../repository/federative-unit.repository";
import { Injectable, Scope } from "@nestjs/common";
import { FederativeUnitResponse } from "../integration/response/federative-unit.response";
import { FederativeUnitMapper } from "../mapper/federative-unit.mapper";

@Injectable()
export class FederativeUnitService {
    constructor(
        private repository: FederativeUnitRepository
    ) { }

    public getAll(): Promise<FederativeUnitResponse[]> {
        return this.repository.getAll()
            .then(result => FederativeUnitMapper.entityListToResponse(result))
    }

    public getSingle(code: number): Promise<FederativeUnitResponse> {
        return this.repository.getSingle(code)
            .then(result => FederativeUnitMapper.entityToResponse(result));
    }

    public getCities(code: number): Promise<CityResponse[]> {
        return this.repository.getCities(code)
            .then(result => CityMapper.entityListToResponse(result));
    }

    public getByCity(cityCode: number): Promise<FederativeUnitResponse> {
        return this.repository.getByCity(cityCode)
            .then(result => FederativeUnitMapper.entityToResponse(result));
    }
}
