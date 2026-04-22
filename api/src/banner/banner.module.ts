import { Module } from '@nestjs/common';
import { BannerController } from './controller/banner.controller';
import {BannerService} from "./service/banner.service";
import {BannerRepository} from "./repository/banner.repository";
import {CommomModule} from "../common/commom.module";

@Module({
  controllers: [BannerController],
  providers: [
      BannerService,
      BannerRepository
  ],
    imports: [
        CommomModule
    ]
})
export class BannerModule {}
