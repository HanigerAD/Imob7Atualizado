import { CityRepository } from "../repository/city.repository";
import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { CityRequest } from "../integration/request/city.request";
import { CityMapper } from "../mapper/city.mapper";
import { CityResponse } from "../integration/response/city.response";
import { FederativeUnitResponse } from "../../federative-unit/integration/response/federative-unit.response";
import { CityBuilder } from "../builder/city.builder";
import { NeighborhoodResponse } from "src/locality/neighborhood/integration/response/neighborhood.response";
import { NeighborhoodMapper } from "src/locality/neighborhood/mapper/neighborhood.mapper";
import { FederativeUnitMapper } from "src/locality/federative-unit/mapper/federative-unit.mapper";
import { PropertyMapper } from "src/property/property/mapper/property.mapper";
import { PropertyRepository } from "src/property/property/repository/property.repository";
import { PropertyResponse } from "src/property/property/integration/response/property.response";

@Injectable()
export class CityService {
    constructor(
        private repository: CityRepository,
        private propertyRepository: PropertyRepository
    ) {
    }

    public insert(request: CityRequest): Promise<number> {
        return this.repository.insert(CityMapper.requestToEntity(request));
    }

    public getAll(): Promise<CityResponse[]> {
        return this.repository.getAll()
            .then(cities => CityMapper.entityListToResponse(cities));
    }

    public getSingle(code: number): Promise<CityResponse> {
        return this.repository.getSingle(code)
            .then(result => this.buildResponse(CityMapper.entityToResponse(result)))
    }

    public update(code: number, request: CityRequest): Promise<number> {
        return this.repository.update(code, CityMapper.requestToEntity(request));
    }

    public getNeighborhoods(code: number): Promise<NeighborhoodResponse[]> {
        return this.repository.getNeighborhoods(code)
            .then(result => NeighborhoodMapper.entityListToResponse(result));
    }

    public getProperties(code: number): Promise<PropertyResponse[]> {
        return this.propertyRepository.getAll({ paginacao: { pagina: 1, porPagina: 1000 }, municipio: code })
            .then(result => PropertyMapper.entityListToResponse(result));
    }

    public getFederativeUnit(code: number): Promise<FederativeUnitResponse> {
        return this.repository.getFederativeUnit(code)
            .then(uf => FederativeUnitMapper.entityToResponse(uf));
    }

    public getCityByNeighborhood(neighborhoodCode: number): Promise<CityResponse> {
        return this.repository.getCityByNeighborhood(neighborhoodCode)
            .then(result => this.buildResponse(CityMapper.entityToResponse(result)));
    }

    public async buildResponse(city: CityResponse): Promise<CityResponse> {
        const builder = new CityBuilder();
        builder.cityData(city);
        return builder.build();
    }

    public async delete(code: number): Promise<number> {
        const properties = await this.getProperties(code);
        const neighborhoods = await this.getNeighborhoods(code);

        if ((properties && properties.length) || (neighborhoods && neighborhoods.length)) {
            const message = 'Não foi possivel deletar o registro pois o mesmo contem outros registros vinculados.';
            throw new BadRequestException({
                message,
                properties,
                neighborhoods,
            }, message);
        } else {
            try {
                return this.repository.delete(code);
            } catch (error) {
                throw new ConflictException(error, 'Erro ao executar comando no banco de dados')
            }
        }
    }
}
