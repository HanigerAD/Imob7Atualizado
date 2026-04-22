import {CityModel} from '../model/city.model';
import {CityResponse} from '../integration/response/city.response';
import {Builder} from 'builder-pattern';
import {NeighborhoodResponse} from '../integration/response/neighborhood.response';
import {NeighborhoodModel} from '../model/neighborhood.model';
import {TypeResponse} from '../integration/response/type.response';
import {TypeModel} from '../model/type.model';
import {FinalityResponse} from '../integration/response/finality.response';
import {FinalityModel} from '../model/finality.model';
import {ZoneResponse} from '../integration/response/zone.response';
import {ZoneModel} from '../model/zone.model';

export class FiltersMapper {

    public static mapFinalitiesArrayResponseToModel(response: FinalityResponse[]): FinalityModel[] {
        return response.map(finality => this.mapFinalityResponseToModel(finality));
    }

    public static mapFinalityResponseToModel(response: FinalityResponse): FinalityModel {
        return Builder<FinalityModel>()
            .code(response.code)
            .description(response.description)
        .build();
    }

    public static mapZonesArrayResponseToModel(response: ZoneResponse[]): ZoneModel[] {
        return response.map(type => this.mapZoneResponseToModel(type));
    }

    public static mapZoneResponseToModel(response: ZoneResponse): ZoneModel {
        return Builder<ZoneModel>()
            .code(response.code)
            .description(response.description)
            .build();
    }

    public static mapTypesArrayResponseToModel(response: TypeResponse[]): TypeModel[] {
        return response.map(type => this.mapTypeResponseToModel(type));
    }

    public static mapTypeResponseToModel(response: TypeResponse): TypeModel {
        return Builder<TypeModel>()
            .code(response.code)
            .description(response.description)
        .build();
    }

    public static mapCitiesArrayResponseToModel(response: CityResponse[]): CityModel[] {
        return response.map(city => this.mapCityResponseToModel(city));
    }

    public static mapCityResponseToModel(response: CityResponse): CityModel {
        return Builder<CityModel>()
            .code(response.code)
            .description(response.description)
        .build();
    }

    public static mapNeighborhoodsArrayResponseToModel(response: NeighborhoodResponse[]): NeighborhoodModel[] {
        return response.map(city => this.mapNeighborhoodResponseToModel(city));
    }

    public static mapNeighborhoodResponseToModel(response: NeighborhoodResponse): NeighborhoodModel {
        return Builder<NeighborhoodModel>()
            .code(response.code)
            .description(response.description)
            .city(response.city)
        .build();
    }

}
