import { Builder } from 'builder-pattern';
import { environment } from 'src/environments/environment';
import { PartnerResponse } from '../integration/response/partner.response';
import { PartnerModel } from '../model/partner.model';

export class PartnerMapper {

    private static cdnEndpoint: string = environment.endpoint.cdn;

    public static mapPartnersArrayResponseToModel(response: PartnerResponse[]): PartnerModel[] {
        return response.map(property => this.mapPartnerResponseToModel(property));
    }

    public static mapPartnerResponseToModel(response: PartnerResponse): PartnerModel {
        return Builder<PartnerModel>()
            .code(response.code)
            .image(`${this.cdnEndpoint}${response.image}`)
            .name(response.name)
            .build();
    }
}
