import {PhoneResponse} from "../integration/response/phone.response";
import {ConfigurationResponse} from "../integration/response/configuration.response";

export class ConfigurationSiteBuilder {
    public configuration: ConfigurationResponse;

    public build(): ConfigurationResponse {
        return this.configuration;
    }

    public setConfiguration(configuration: ConfigurationResponse): ConfigurationSiteBuilder {
        this.configuration = configuration;
        return this;
    }

    public setPhone(phone: PhoneResponse[]): ConfigurationSiteBuilder {
        this.configuration.phone = phone;
        return this;
    }

    public setEmail(email: string): ConfigurationSiteBuilder {
        this.configuration.email = email;
        return this;
    }
}
