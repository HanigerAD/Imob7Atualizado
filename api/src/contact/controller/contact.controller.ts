import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { ContactService } from "../service/contact.service";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { NewPropertyRequest } from "../integration/request/new-property.request";
import { NewPropertyResponse } from "../integration/response/new-property.response";
import { MessageRequest } from "../integration/request/message.request";
import { MessageResponse } from "../integration/response/message.response";

@Controller('contact')
export class ContactController {
  constructor(
    private service: ContactService
  ) {
  }

  @Post('new-property')
  public async insertNewPropertyContact(@Body() request: NewPropertyRequest): Promise<number> {
    return this.service.insertNewPropertyContact(request);
  }

  @Get('new-properties')
  public async getAllNewPropertiesContacts(): Promise<NewPropertyResponse[]> {
    return this.service.getAllNewPropertiesContacts();
  }

  @Get('new-properties/:code')
  public async getSingleNewPropertyContact(@Param('code') code: number): Promise<NewPropertyResponse> {
    return this.service.getSingleNewPropertyContact(code);
  }

  @Get('new-properties-contacts-counter')
  public async getNewPropertiesContactsCounter(): Promise<number> {
    return this.service.newPropertiesContactsCounter();
  }

  @Patch('new-properties/:code')
  @HttpCode(HttpStatus.OK)
  public async updateNewPropertyContact(@Param('code') code: number, @Body() request: NewPropertyRequest): Promise<number> {
    return this.service.updateNewPropertyContact(code, request);
  }

  @Delete('new-properties/:code')
  @HttpCode(HttpStatus.OK)
  public async deleteNewPropertiesContact(@Param('code') code: number): Promise<number> {
    return this.service.deleteNewPropertiesContact(code);
  }

  @Post('message')
  public async insertMessage(@Body() request: MessageRequest): Promise<number> {
    return this.service.insertMessage(request);
  }

  @Get('messages')
  public async getAllMessage(): Promise<MessageResponse[]> {
    return this.service.getAllMessages();
  }

  @Get('messages/:code')
  public async getSingleMessage(@Param('code') code: number): Promise<MessageResponse> {
    return this.service.getSingleMessage(code);
  }

  @Get('messages-counter')
  public async messagesCounter(): Promise<number> {
    return this.service.messagesCounter();
  }

  @Patch('messages/:code')
  @HttpCode(HttpStatus.OK)
  public async updateMessage(@Param('code') code: number, @Body() request: MessageRequest): Promise<number> {
    return this.service.updateMessage(code, request);
  }

  @Delete('messages/:code')
  @HttpCode(HttpStatus.OK)
  public async deleteMessage(@Param('code') code: number): Promise<number> {
    return this.service.deleteMessage(code);
  }

}
