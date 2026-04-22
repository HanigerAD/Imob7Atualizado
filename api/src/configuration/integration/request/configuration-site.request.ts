import {PhoneRequest} from "./phone.request";

export class ConfigurationSiteRequest {
    public logo?: string;
    public title?: string;
    public institutionalText?: string;
    public openingHour?: string;
    public institutionalTextResume?: string;
    public phone?: PhoneRequest[];
    public email?: string;
}
