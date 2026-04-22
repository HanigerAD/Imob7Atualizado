import {CityResponse} from "../integration/response/city.response";

export class CityBuilder {
    public city: CityResponse;

    constructor() {
        this.city = new CityResponse();
    }

    public build(): CityResponse {
        return this.city;
    }

    public cityData(city: CityResponse): CityBuilder {
        this.city = city;
        return this;
    }
}
