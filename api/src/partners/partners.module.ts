import { Module } from "@nestjs/common";
import { PartnerController } from "./controller/partner.controller";
import { PartnerService } from "./service/partner.service";
import { PartnerRepository } from "./repository/partner.repository";
import { CommomModule } from "src/common/commom.module";

@Module({
  controllers: [PartnerController],
  providers: [PartnerService, PartnerRepository],
  imports: [CommomModule],
})
export class PartnerModule {}
