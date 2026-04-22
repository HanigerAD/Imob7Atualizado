import {PhoneRepository} from "../repository/phone.repository";
import {PhoneResponse} from "../integration/response/phone.response";
import {PhoneMapper} from "../mapper/phone.mapper";
import {Injectable} from "@nestjs/common";
import {PhoneRequest} from "../integration/request/phone.request";

@Injectable()
export class PhoneService {
    constructor(
        private repository: PhoneRepository
    ) {
    }

    public getPhone(commercialEntityCode: number): Promise<PhoneResponse[]> {
        return this.repository.getPhone(commercialEntityCode)
            .then(phones => PhoneMapper.entityListToResponse(phones));
    }

    public insertPhone(requests: PhoneRequest[]): Promise<number[]> {
        return this.repository.insertPhone(PhoneMapper.requestListToEntity(requests));
    }

    public deletePhone(commercialEntityCode: number): Promise<number> {
        return this.repository.deletePhone(commercialEntityCode);
    }

    public updatePhones(commercialEntityCode: number, phones: PhoneRequest[]): Promise<number[]> {
        return this.deletePhone(commercialEntityCode)
            .then(() => this.insertPhone(phones))
    }


}
