import { CityResponse } from './../../city/integration/response/city.response';
import { NeighborhoodResponse } from "../integration/response/neighborhood.response";

export class NeighborhoodBuilder {
    public neighborhood: NeighborhoodResponse;

    constructor() {
        this.neighborhood = new NeighborhoodResponse();
    }

    public build(): CityResponse {
        return this.neighborhood;
    }

    public neighborhoodData(neighborhood: NeighborhoodResponse): NeighborhoodBuilder {
        this.neighborhood = neighborhood;
        return this;
    }
}
