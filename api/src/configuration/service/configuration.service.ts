import {Injectable} from "@nestjs/common";
import {ConfigurationRepository} from "../repository/configuration.repository";
import {ConfigurationSiteRequest} from "../integration/request/configuration-site.request";
import {ConfigurationSiteMapper} from "../mapper/configuration-site.mapper";
import {ConfigurationResponse} from "../integration/response/configuration.response";
import {PhoneService} from "../../commercial-entity/phone/service/phone.service";
import {ConfigurationSiteBuilder} from "../builder/configuration-site.builder";
import {CommercialEntityEnum} from "../../common/enum/commercial-entity.enum";
import {CommercialEntityService} from "../../commercial-entity/service/commercial-entity.service";
import {PhoneRequest} from "../integration/request/phone.request";
import {ImageService} from "../../common/service/image.service";
import {ImageRequest} from '../../common/integration/request/image.request';
import {Builder} from 'builder-pattern';
import {ImageSizeEnum} from '../../common/enum/image-size.enum';
import {Response} from 'express';


@Injectable()
export class ConfigurationService {
    constructor(
        private repository: ConfigurationRepository,
        private phoneService: PhoneService,
        private commercialEntityService: CommercialEntityService,
        private imageService: ImageService
    ) {
    }

    public update(request: ConfigurationSiteRequest): Promise<number> {
        return this.repository.update(ConfigurationSiteMapper.requestToEntity(request))
            // .then(() => this.phoneService.updatePhones(CommercialEntityEnum.REAL_STATE, this.definePhoneCommercialEntity(request.phone)))
            // .then(() => this.commercialEntityService.updateEmail(CommercialEntityEnum.REAL_STATE, request.email));
    }

    public definePhoneCommercialEntity(requests: PhoneRequest[]): PhoneRequest[] {
        requests.forEach(request => request.commercialEntity = CommercialEntityEnum.REAL_STATE);
        return requests;
    }

    public get(): Promise<ConfigurationResponse> {
        return this.repository.get()
            .then(result => ConfigurationSiteMapper.entityToResponse(result))
            .then(configuration => this.buildResponse(configuration));
    }

    public async buildResponse(configuration: ConfigurationResponse): Promise<ConfigurationResponse> {
        const builder = new ConfigurationSiteBuilder();
        builder.setConfiguration(configuration);
        return builder.build();
    }

    public async updateLogo(file: Express.Multer.File, res: Response): Promise<number> {
        await this.imageService.saveImages(this.buildPropertyImage(file));
        return this.repository.updateLogo(file.filename);
    }

    public buildPropertyImage(file: Express.Multer.File): ImageRequest[] {
        return Array.of(
            Builder<ImageRequest>()
                .file(file)
                .width(ImageSizeEnum.LOGO_WIDTH)
                .height(null)
                .build()
        );
    }

}
