import { PhoneModel } from './phone.model';
import {PhoneResponse} from '../integration/response/phone.response';

export class ConfigurationModel {
    public code?: number;
    public logo?: string;
    public title?: string;
    public institutionalText?: string;
    public weekOpeningHour?: string;
    public weekClosingHour?: string;
    public saturdayOpeningHour?: string;
    public saturdayClosingHour?: string;
    public sundayOpeningHour?: string;
    public sundayClosingHour?: string;
    public institutionalTextResume?: string;
    public phone?: PhoneResponse[];
    public email?: string;
    public address?: string;
}
