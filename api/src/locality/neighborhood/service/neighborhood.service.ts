import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { PropertyResponse } from 'src/property/property/integration/response/property.response';
import { PropertyMapper } from 'src/property/property/mapper/property.mapper';
import { PropertyRepository } from 'src/property/property/repository/property.repository';

import { CityService } from '../../city/service/city.service';
import { NeighborhoodBuilder } from '../builder/neighborhood.builder';
import { NeighborhoodRequest } from '../integration/request/neighborhood.request';
import { NeighborhoodResponse } from '../integration/response/neighborhood.response';
import { NeighborhoodMapper } from '../mapper/neighborhood.mapper';
import { NeighborhoodRepository } from '../repository/neighborhood.repository';
import { PaginationDTO } from './../../../common/dto/pagination.dto';
import { CityResponse } from './../../city/integration/response/city.response';

@Injectable()
export class NeighborhoodService {
    constructor(
        private repository: NeighborhoodRepository,
        private cityService: CityService,
        private propertyRepository: PropertyRepository
    ) { }

    public insert(request: NeighborhoodRequest): Promise<number> {
        return this.repository.insert(NeighborhoodMapper.requestToEntity(request));
    }

    public getAll(pagination: PaginationDTO, res: Response): Promise<NeighborhoodResponse[]> {
        return this.repository.basicQuery()
            .then(result => { res.set('Count', result.length); return result })
            .then(result => this.repository.getAll(pagination, result))
            .then(result => NeighborhoodMapper.entityListToResponse(result));
    }

    public getSingle(code: number): Promise<NeighborhoodResponse> {
        return this.repository.getSingle(code)
            .then(result => this.buildResponse(NeighborhoodMapper.entityToResponse(result)));
    }

    public update(code: number, request: NeighborhoodRequest): Promise<number> {
        return this.repository.update(code, NeighborhoodMapper.requestToEntity(request));
    }

    public getCity(neighborhoodCode: number): Promise<CityResponse> {
        return this.cityService.getCityByNeighborhood(neighborhoodCode)
    }

    public getNeighborhoodByAddress(addressCode: number): Promise<NeighborhoodResponse> {
        return this.repository.getNeighborhoodByAddress(addressCode)
            .then(result => this.buildResponse(NeighborhoodMapper.entityToResponse(result)))
    }

    public getProperties(code: number): Promise<PropertyResponse[]> {
        return this.propertyRepository.getAll({ paginacao: { pagina: 1, porPagina: 1000 }, bairro: [String(code)] })
            .then(result => PropertyMapper.entityListToResponse(result));
    }

    public async buildResponse(neighborhood: NeighborhoodResponse): Promise<NeighborhoodResponse> {
        const builder = new NeighborhoodBuilder();
        builder.neighborhoodData(neighborhood);
        return builder.build();
    }

    public async delete(code: number): Promise<number> {
        const properties = await this.getProperties(code);
        console.log({ properties })

        if ((properties && properties.length)) {
            const message = 'Não foi possivel deletar o registro pois o mesmo contem outros registros vinculados.';
            throw new BadRequestException({
                message,
                properties,
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
