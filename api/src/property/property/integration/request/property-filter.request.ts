export class PropertyFilterRequest {
    public finality?: number;
    public internalCode?: number;
    public type?: number;
    public maxPrice?: number;
    public minPrice?: number;
    public city?: number;
    public neighborhood?: string[];
    public zone?: number;
    public hectare?: number;
    public code?: number;
    public page: number;
    public perPage: number;
    public financeable?: number;
    public showSite?: number;
    public category?: string;
    public bedroom?: number;
    public parkingVacancy?: number;
    public bathroom?: number;
}
