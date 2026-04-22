import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {AuthenticationController} from './controller/authentication.controller';
import {AuthenticationRespository} from './repository/authentication.repository';
import {AuthenticationService} from './service/authentication.service'
import {ConfigService} from '@nestjs/config'
import {JwtStrategy} from './config/jwt.strategy';
import {ConfigurationModule} from '../configuration/configuration.module';
import {UserModule} from "../user/user.module";

@Module({
    controllers: [
        AuthenticationController
    ],
    providers: [
        AuthenticationService,
        AuthenticationRespository,
        JwtStrategy
    ],
    imports: [
        JwtModule.registerAsync({
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_KEY')
            }),
            inject: [ConfigService]
        }),
        ConfigurationModule,
        UserModule
    ]
})
export class AuthenticationModule {
    constructor(
        private config: ConfigService
    ) {
    }
}
