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
  Put,
  Query,
  Res,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor, FilesInterceptor } from "@nestjs/platform-express";
import { Response } from "express";

import { JwtAuthGuard } from "../../../authentication/config/jwt-auth.guard";
import { SituationResponse } from "../../../user/integration/response/situation.response";
import { CategoryResponse } from "../../category/integration/response/category.response";
import { ConservationStateResponse } from "../../conservation-state/integration/response/conservation-state.response";
import { ProfileResponse } from "../../profile/integration/response/profile.response";
import { TransactionResponse } from "../../transaction/integration/response/transaction.response";
import { TypeResponse } from "../../type/integration/response/type.response";
import { ZoneResponse } from "../../zone/integration/response/zone.response";
import { PropertyFilterRequest } from "../integration/request/property-filter.request";
import { PropertyRequest } from "../integration/request/property.request";
import { PropertyBasicDataService } from "../service/property-basic-data.service";
import { PropertyService } from "../service/property.service";
import { PropertyDetailResponse } from "./../integration/response/property-detail.response";
import { ImageSortRequest } from "../integration/request/image-sort.request";
import { PropertyDocumentResponse } from "../integration/response/property-document.response";
import { LogRequest } from "../integration/request/log.request";
import { LogResponse } from "../integration/response/log.response";
import { CategoryRequest } from "../../../property/category/integration/response/category.request";

@Controller("property")
export class PropertyController {
  constructor(
    private service: PropertyService,
    private basicDataService: PropertyBasicDataService
  ) { }

  @Post("properties")
  @UseGuards(JwtAuthGuard)
  public async insertProperty(@Body() request: PropertyRequest): Promise<number> {
    return this.service.insertProperty(request);
  }

  @Get("properties/generate-images-with-watermark")
  @UseGuards(JwtAuthGuard)
  public async generateImagesWithWatermark(
    @Res() res: Response
  ): Promise<void> {
    return this.service.generateImagesWithWatermark(res);
  }

  @Post("properties/:code/images")
  @UseInterceptors(FilesInterceptor("files"))
  @HttpCode(HttpStatus.OK)
  public async insertImages(
    @Param("code") code: number,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<boolean> {
    return this.service.insertPropertyImages(files, code);
  }

  @Put("properties/:code/images")
  @UseInterceptors(FilesInterceptor("files"))
  @HttpCode(HttpStatus.OK)
  public async updateImages(
    @Param("code") code: number,
    @UploadedFiles() files: Express.Multer.File[]
  ): Promise<boolean> {
    return this.service.insertPropertyImages(files, code);
  }

  @Post("properties/:code/image")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  public async insertImage(
    @Param("code") code: number,
    @Query("order") order: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<boolean> {
    return this.service.insertPropertyImage(file, code, order);
  }

  @Put("properties/images-sort")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async updateImagesSort(@Body() imagesSort: ImageSortRequest[]): Promise<void> {
    return this.service.updateImagesSort(imagesSort);
  }

  @Patch("properties/:code/delete-images")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async deleteImages(
    @Param("code") code: number,
    @Body() deletedImages: string[]
  ): Promise<void> {
    return this.service.deleteImages(deletedImages);
  }

  @Patch("properties/:code/delete-documents")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async deleteDocuments(
    @Param("code") code: number,
    @Body() deletedDocuments: string[]
  ): Promise<void> {
    return this.service.deleteDocuments(deletedDocuments);
  }

  @Delete("properties/:code")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async deleteProperty(@Param("code") code: number): Promise<number> {
    return this.service.delete(code);
  }

  @Get("properties")
  public async getAllProperty(
    @Query() filter: PropertyFilterRequest
  ): Promise<any> {
    return this.service.getAllProperties(filter);
  }

  @Get("counter/properties")
  public async getAllPropertiesCounter(
    @Query() filter: PropertyFilterRequest
  ): Promise<number> {
    return this.service.getAllPropertiesCounter(filter);
  }

  @Get("properties/:code")
  public async getSingleProperty(
    @Param("code") code: number
  ): Promise<PropertyDetailResponse> {
    return this.service.getSingle(code);
  }

  @Patch("properties/:code")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async updateProperty(
    @Param("code") code: number,
    @Body() request: PropertyRequest
  ): Promise<number> {
    return this.service.update(code, request);
  }

  @Post("properties/:code/document")
  @UseInterceptors(FileInterceptor("file"))
  @HttpCode(HttpStatus.OK)
  public async insertDocument(
    @Param("code") code: number,
    @UploadedFile() file: Express.Multer.File
  ): Promise<void> {
    return this.service.insertPropertyDocument(file, code);
  }

  @Post("properties/:code/documents")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FilesInterceptor("files"))
  public async insertDocuments(
    @Param("code") code: number,
    @UploadedFiles() files: Express.Multer.File[],
    @Res() response: Response
  ) {
    return this.service.insertDocuments(files, code, response);
  }

  @Get("counter/rent")
  public async getRentCounter(): Promise<number> {
    return this.service.getRentCounter();
  }

  @Get("counter/sell")
  public async getSellCounter(): Promise<number> {
    return this.service.getSellCounter();
  }

  @Get("properties/:code/images/urls")
  public async getPropertyImageUrl(
    @Param("code") code: number
  ): Promise<string[]> {
    return this.service.getPropertyImagesUrls(code);
  }

  @Get("properties/:code/documents")
  public async getPropertyDocuments(
    @Param("code") code: number
  ): Promise<PropertyDocumentResponse[]> {
    return this.service.getPropertyDocuments(code);
  }

  @Get("/transactions")
  public async getTransactions(): Promise<TransactionResponse[]> {
    return this.basicDataService.getTransactions();
  }

  @Get("/zones")
  public async getZones(): Promise<ZoneResponse[]> {
    return this.basicDataService.getZones();
  }

  @Get("/categories")
  public async getCategories(): Promise<CategoryResponse[]> {
    return this.basicDataService.getCategories();
  }

  @Post('/categories')
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: CategoryRequest): Promise<number> {
    return this.service.insertCategory(request);
  }

  @Get('/categories/:code')
  public async getCategory(@Param('code') code: number): Promise<CategoryResponse> {
    return this.service.getCategory(code);
  }

  @Patch('/categories/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async updateCategory(@Param('code') code: number, @Body() request: CategoryRequest): Promise<number> {
    return this.service.updateCategory(code, request);
  }

  @Delete('/categories/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async deleteCategory(@Param('code') code: number): Promise<number> {
    return this.service.deleteCategory(code);
  }

  @Get("/types")
  public async getTypes(): Promise<TypeResponse[]> {
    return this.basicDataService.getTypes();
  }

  @Get("/conservation-states")
  public async getConservationStates(): Promise<ConservationStateResponse[]> {
    return this.basicDataService.getConservationStates();
  }

  @Get("/situations")
  public async getSituations(): Promise<SituationResponse[]> {
    return this.basicDataService.getSituations();
  }

  @Get("/profiles")
  public async getProfiles(): Promise<ProfileResponse[]> {
    return this.basicDataService.getProfiles();
  }

  @Post("/logs")
  public async insertLogs(@Body() logsRequest: LogRequest[]): Promise<void> {
    return this.service.insertLogs(logsRequest);
  }

  @Get("/logs/:code")
  public async getLogs(@Param("code") propertyCode: number): Promise<LogResponse[]> {
    return this.service.getLogs(propertyCode);
  }

  @Get("/logs/description/:field/:value")
  public async getValueLog(
    @Param("field") field: string,
    @Param("value") value: number
  ): Promise<any> {
    return this.service.getValueLog(field, value);
  }

  @Get("feed.xml")
public async getFeed(@Res() res: Response): Promise<void> {
  const xml = await this.service.getFeedXml();

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml);
}

}
