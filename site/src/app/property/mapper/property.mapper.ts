import {PropertyModel} from '../models/property.model';
import {PropertyResponse} from '../integration/response/property.response';
import {Builder} from 'builder-pattern';
import {PropertyDetailsModel} from '../models/property-details.model';
import {PropertyDetailsResponse} from '../integration/response/property-details.response';

export class PropertyMapper {

    public static mapPropertiesArrayResponseToModel(response: PropertyResponse[]): PropertyModel[] {
        return response.map(property => this.mapPropertyResponseToModel(property));
    }

    public static mapPropertyResponseToModel(response: PropertyResponse): PropertyModel {
        return Builder<PropertyModel>()
            .code(response.code)
            .internalCode(response.internalCode)
            .photo(response.photo)
            .title(response.title)
            .price(response.price)
            .transaction(response.transaction)
            .category(response.category)
            .bedroom(response.bedroom)
            .parkingVacancy(response.parkingVacancy)
            .totalArea(response.totalArea)
            .zone(response.zone)
            .city(response.city)
            .neighborhood(response.neighborhood)
            .financeable(response.financeable)
        .build();
    }

    public static mapPropertyDetailsResponseToModel(response: PropertyDetailsResponse): PropertyDetailsModel {
        return Builder<PropertyDetailsModel>()
            .code(response.code)
            .internalCode(response.internalCode)
            .show(response.show)
            .title(response.title)
            .price(response.price)
            .dormitory(response.dormitory)
            .unitAvailable(response.unitAvailable)
            .bathroom(response.bathroom)
            .parkingVacancy(response.parkingVacancy)
            .privativeArea(response.privativeArea)
            .totalArea(response.totalArea)
            .pavement(response.pavement)
            .financeable(response.financeable)
            .description(response.description)
            .privateInfo(response.privateInfo)
            .reserved(response.reserved)
            .hectare(response.hectare)
            .constuctionYear(response.constuctionYear)
            .featured(response.featured)
            .superFeatured(response.superFeatured)
            .suite(response.suite)
            .rented(response.rented)
            .condominiumPrice(response.condominiumPrice)
            .showValue(response.showValue)
            .zipCode(response.zipCode)
            .street(response.street)
            .number(response.number)
            .complement(response.complement)
            .latitude(response.latitude)
            .longitude(response.longitude)
            .agent(response.agent)
            .category(response.category)
            .conservationState(response.conservationState)
            .profile(response.profile)
            .type(response.type)
            .zone(response.zone)
            .transaction(response.transaction)
            .federativeUnit(response.federativeUnit)
            .city(response.city)
            .neighborhood(response.neighborhood)
        .build();
    }

}
