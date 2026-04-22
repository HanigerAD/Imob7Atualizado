import { Module } from '@nestjs/common';
import { ContactController } from './controller/contact.controller';
import {ContactService} from "./service/contact.service";
import {ContactRepository} from "./repository/contact.repository";
import {CommomModule} from "../common/commom.module";

@Module({
  controllers: [ContactController],
  providers: [
      ContactService,
      ContactRepository
  ],
    imports: [
        CommomModule
    ]
})
export class ContactModule {}
