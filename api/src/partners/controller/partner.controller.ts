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
  UseInterceptors,
} from "@nestjs/common";
import { PartnerService } from "../service/partner.service";
import { PartnerRequest } from "../integration/request/partner.request";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { PartnerResponse } from "../integration/response/partner.response";
import { FileInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

@Controller("partner")
export class PartnerController {
  constructor(private service: PartnerService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: PartnerRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get()
  public async getAll(): Promise<PartnerResponse[]> {
    return this.service.getAll();
  }

  @Get(":code")
  @UseGuards(JwtAuthGuard)
  public async getSingle(@Param("code") code: number): Promise<PartnerResponse> {
    return this.service.getSingle(code);
  }

  @Patch(":code")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param("code") code: number,
    @Body() request: PartnerRequest
  ): Promise<number> {
    return this.service.update(code, request);
  }

  @Delete(":code")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param("code") code: number): Promise<number> {
    return this.service.delete(code);
  }

  @Post(":code/image")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  public async uploadFile(
    @Param("code") code: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response
  ): Promise<number> {
    return this.service.setImage(code, file, res);
  }
}
