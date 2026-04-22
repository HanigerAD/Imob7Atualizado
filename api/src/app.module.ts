import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthenticationModule } from "./authentication/authentication.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { KnexModule } from "nestjs-knex";
import { UserModule } from "./user/user.module";
import { PostModule } from "./post/post.module";
import { BannerModule } from "./banner/banner.module";
import { SobreNosBannerModule } from "./sobre_nos_banner/sobre_nos_banner.module";
import { AgentModule } from "./agent/agent.module";
import { ConfigurationModule } from "./configuration/configuration.module";
import { LocalityModule } from "./locality/locality.module";
import { PropertyModule } from "./property/property.module";
import { CommercialEntityModule } from "./commercial-entity/commercial-entity.module";
import { CommomModule } from "./common/commom.module";
import { ContactModule } from "./contact/contact.module";
import { APP_FILTER } from "@nestjs/core";
import { AllExceptionsFilter } from "./common/filter/all-exceptions.filter";
import { PartnerModule } from "./partners/partners.module";

@Module({
  imports: [
    KnexModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        config: {
          client: "mysql",
          useNullAsDefault: true,
          debug: true,
          asyncStackTraces: true,
          connection: {
            host: configService.get<string>("DB_HOST"),
            port: configService.get<string>("DB_PORT"),
            database: configService.get<string>("DB_NAME"),
            user: configService.get<string>("DB_USER"),
            password: configService.get<string>("DB_PASS"),
            timezone: "utc+3",
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthenticationModule,
    UserModule,
    PostModule,
    BannerModule,
    SobreNosBannerModule,
    AgentModule,
    PartnerModule,
    ConfigurationModule,
    LocalityModule,
    PropertyModule,
    CommercialEntityModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, "..", "uploads"),
    // }),
    CommomModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule { }
