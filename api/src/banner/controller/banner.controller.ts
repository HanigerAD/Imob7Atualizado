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
import { BannerService } from "../service/banner.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { BannerResponse } from "../integration/response/banner.response";

@Controller("banner")
export class BannerController {
  constructor(private service: BannerService) { }

  @Post("")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor("file"))
  public async insert(
    @UploadedFile() file: Express.Multer.File,
    @Res() res
  ): Promise<number> {
    return this.service.insert(file, res);
  }

  @Get()
  public async getAll(): Promise<BannerResponse[]> {
    return this.service.getAll();
  }

  @Delete(":image")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param("image") image: string): Promise<number> {
    return this.service.delete(image);
  }
}
