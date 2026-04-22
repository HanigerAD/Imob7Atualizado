import {ForbiddenException, Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {AuthenticationRespository} from '../repository/authentication.repository';
import {LoginRequest} from '../integration/request/login.request';
import {AuthenticationMapper} from '../mapper/authentication.mapper';
import {LoginResponse} from '../integration/response/login.response';
import {ConfigurationService} from '../../configuration/service/configuration.service';
import {LoginBuilder} from '../builder/login.builder';
import {UserMapper} from '../../user/mapper/user.mapper';
import {UserResponse} from '../../user/integration/response/user.response';
import {UserEntity} from '../../user/entity/user.entity';
import {UserService} from "../../user/service/user.service";

@Injectable()
export class AuthenticationService {
    constructor(
        private repository: AuthenticationRespository,
        private jwtService: JwtService,
        private configurationService: ConfigurationService,
        private userService: UserService
    ) {
    }

    public async login(user: LoginRequest): Promise<LoginResponse> {
        const builder = new LoginBuilder();
        return this.repository.searchUser(AuthenticationMapper.requestToEntity(user))
            .then(user => builder.setUser(this.validateUser(user)))
            .then(user => this.userService.getUserPermissions(user.getCode()))
            .then(permissions => builder.setPermissions(permissions))
            .then(() => builder.setToken(this.jwtService.sign(builder.build().user.code.toString())))
            .then(() => this.configurationService.get())
            .then(configuration => builder.setConfiguration(configuration))
            .then(() => builder.build())
    }

    public validateUser(user: UserEntity): UserResponse {
        if (user) {
            return UserMapper.entityToResponse(user)
        }
        throw new ForbiddenException('Usuário ou senha incorretos');
    }

}
