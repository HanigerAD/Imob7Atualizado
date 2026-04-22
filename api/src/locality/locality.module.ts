import { Module } from '@nestjs/common';
import { CityController } from './city/controller/city.controller';
import { CityService } from "./city/service/city.service";
import { CityRepository } from "./city/repository/city.repository";
import { NeighborhoodController } from "./neighborhood/controller/neighborhood.controller";
import { NeighborhoodService } from "./neighborhood/service/neighborhood.service";
import { NeighborhoodRepository } from "./neighborhood/repository/neighborhood.repository";
import { FederativeUnitController } from "./federative-unit/controller/federative-unit.controller";
import { FederativeUnitService } from "./federative-unit/service/federative-unit.service";
import { FederativeUnitRepository } from "./federative-unit/repository/federative-unit.repository";
import { PropertyRepository } from 'src/property/property/repository/property.repository';

@Module({
    controllers: [
        CityController,
        NeighborhoodController,
        FederativeUnitController
    ],
    providers: [
        CityService,
        CityRepository,
        NeighborhoodService,
        NeighborhoodRepository,
        FederativeUnitService,
        FederativeUnitRepository,
        PropertyRepository
    ],
    exports: [
        CityService,
        NeighborhoodService,
        FederativeUnitService,
    ]
})
export class LocalityModule {
}
