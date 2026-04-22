import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { SobreNosBannerService } from "../service/sobre_nos_banner.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { SobreNosBannerResponse } from "../integration/response/sobre_nos_banner.response";

@Controller("sobre-nos-banner")
export class SobreNosBannerController {
  constructor(private service: SobreNosBannerService) { }

  @Post("")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  public async insert(
    @UploadedFile() file: Express.Multer.File
  ): Promise<number> {
    return this.service.insert(file);
  }

  @Get()
  public async getAll(): Promise<SobreNosBannerResponse[]> {
    return this.service.getAll();
  }

  @Delete(":image")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param("image") image: string): Promise<number> {
    return this.service.delete(image);
  }
}
