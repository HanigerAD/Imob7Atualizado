import {Module} from '@nestjs/common';
import {ConfigurationController} from './controller/configuration.controller';
import {ConfigurationRepository} from "./repository/configuration.repository";
import {ConfigurationService} from "./service/configuration.service";
import {CommercialEntityModule} from "../commercial-entity/commercial-entity.module";
import {CommomModule} from "../common/commom.module";

@Module({
    controllers: [ConfigurationController],
    providers: [
        ConfigurationRepository,
        ConfigurationService
    ],
    imports: [
        CommercialEntityModule,
        CommomModule
    ],
    exports: [
        ConfigurationService
    ]
})
export class ConfigurationModule {
}
