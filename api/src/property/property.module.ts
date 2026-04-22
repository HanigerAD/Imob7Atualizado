import { PropertyBasicDataRespository } from './property/repository/property-basic-data.respository';
import { PropertyBasicDataService } from './property/service/property-basic-data.service';
import { PropertyService } from './property/service/property.service';
import { PropertyRepository } from './property/repository/property.repository';
import { PropertyController } from './property/controller/property.controller';
import { Module } from '@nestjs/common';
import { LocalityModule } from "../locality/locality.module";
import { CommomModule } from '../common/commom.module';
import { HttpModule } from "@nestjs/axios";
import { ConfigurationModule } from 'src/configuration/configuration.module';

@Module({
    controllers: [PropertyController],
    providers: [
        PropertyRepository,
        PropertyService,
        PropertyBasicDataService,
        PropertyBasicDataRespository
    ],
    imports: [
        ConfigurationModule,
        LocalityModule,
        CommomModule,
        HttpModule
    ]
})
export class PropertyModule {
}
