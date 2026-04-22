
import { Builder } from 'builder-pattern';

import { LoginRequest } from '../integration/request/login.request';
import {LoginModel} from '../model/login.model';
import {LoginResponse} from '../integration/response/login.response';
import {ConfigurationResponse} from '../integration/response/configuration.response';
import {ConfigurationModel} from '../model/configuration.model';

export class ConfigurationMapper {

    public static mapResponseToModel(response: ConfigurationResponse): ConfigurationModel {
        return Builder<ConfigurationModel>()
            .institutionalText(response.institutionalText)
            .institutionalTextResume(response.institutionalTextResume)
            .logo(response.logo)
            .phone(response.phone)
            .email(response.email)
            .address(response.address)
            .weekOpeningHour(response.weekOpeningHour)
            .weekClosingHour(response.weekClosingHour)
            .saturdayOpeningHour(response.saturdayOpeningHour)
            .saturdayClosingHour(response.saturdayClosingHour)
            .sundayOpeningHour(response.sundayOpeningHour)
            .sundayClosingHour(response.sundayClosingHour)
        .build();
    }

}
