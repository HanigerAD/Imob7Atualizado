import {CommercialEntityRepository} from "../repository/commercial-entity.repository";
import {Injectable} from "@nestjs/common";
import {CommercialEntityResponse} from "../integration/response/commercial-entity.response";
import {CommercialEntityMapper} from "../mapper/commercial-entity.mapper";

@Injectable()
export class CommercialEntityService {
    constructor(
        private repository: CommercialEntityRepository
    ) {
    }

    public getSingle(code: number): Promise<CommercialEntityResponse> {
        return this.repository.getSingle(code)
            .then(result => CommercialEntityMapper.entityToResponse(result))
    }

    public updateEmail(code: number, email: string): Promise<number> {
        return this.repository.updateEmail(code, email);
    }
}
