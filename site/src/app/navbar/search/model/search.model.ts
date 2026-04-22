import {PropertyTypeEnum} from '../enum/property-type.enum';
export class SearchModel {
    public city: number | string;
    public code: number | string;
    public finality: number | string;
    public maxPrice: number | string;
    public minPrice: number | string;
    public neighborhood: any;
    public financeable: boolean | number | string;
    public featured: boolean | string;
    public zone: number | string;
    public showSite: number | string;
    public type: PropertyTypeEnum | string;
    public page: number | string;
    public perPage: number | string;
    public bedroom?: number | string;
    public parkingVacancy?: number | string;
    public bathroom?: number | string;
    public suite?: number | string;
}
