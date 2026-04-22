import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ConfigurationService } from "../service/configuration.service";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { ConfigurationSiteRequest } from "../integration/request/configuration-site.request";
import { ConfigurationResponse } from "../integration/response/configuration.response";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from 'express';


@Controller('configuration')
export class ConfigurationController {
  constructor(
    private service: ConfigurationService
  ) {
  }

  @Patch('/site')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(@Body() request: ConfigurationSiteRequest): Promise<number> {
    return this.service.update(request);
  }

  @Get('/site')
  public async get(): Promise<ConfigurationResponse> {
    return this.service.get();
  }

  @Patch('/logo')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  public async updateLogo(@UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<any> {
    return this.service.updateLogo(file, res);
  }

  @Get('/logo')
  public async getLogo(@Res() res): Promise<any> {
    const data: ConfigurationResponse = await this.service.get();
    return res.sendFile(data.logo, process.env.CDN_URL)
  }
}
