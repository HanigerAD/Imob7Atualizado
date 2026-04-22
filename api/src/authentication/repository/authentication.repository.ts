import {Injectable} from "@nestjs/common";
import Knex from "knex";
import {InjectKnex} from "nestjs-knex";
import {UserEntity} from '../../user/entity/user.entity';

@Injectable()
export class AuthenticationRespository {
    constructor(
        @InjectKnex() private readonly knex: Knex
    ) {
    }

    public searchUser(user: UserEntity): Promise<UserEntity> {
        return this.knex
            .select('*')
            .from('usuario')
            .where(user)
            .first();
    }
}
