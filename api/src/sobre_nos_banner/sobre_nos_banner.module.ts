import { Module } from '@nestjs/common';
import { SobreNosBannerController } from './controller/sobre_nos_banner.controller';
import {SobreNosBannerService} from "./service/sobre_nos_banner.service";
import {SobreNosBannerRepository} from "./repository/sobre_nos_banner.repository";
import {CommomModule} from "../common/commom.module";

@Module({
  controllers: [SobreNosBannerController],
  providers: [
      SobreNosBannerService,
      SobreNosBannerRepository
  ],
    imports: [
        CommomModule
    ]
})
export class SobreNosBannerModule {}
