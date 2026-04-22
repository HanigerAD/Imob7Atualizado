import { Module } from '@nestjs/common';
import {PhoneService} from "./phone/service/phone.service";
import {PhoneRepository} from "./phone/repository/phone.repository";
import {CommercialEntityRepository} from "./repository/commercial-entity.repository";
import {CommercialEntityService} from "./service/commercial-entity.service";

@Module({
    providers: [
        PhoneService,
        PhoneRepository,
        CommercialEntityService,
        CommercialEntityRepository
    ],
    exports: [
        PhoneService,
        CommercialEntityService
    ]
})
export class CommercialEntityModule {}
