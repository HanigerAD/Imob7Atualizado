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
import { PostRequest } from "../integration/request/post.request";
import { PostService } from "../service/post.service";
import { PostResponse } from "../integration/response/post.response";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('blog')
export class PostController {
  constructor(
    private service: PostService
  ) {
  }

  @Post('posts')
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: PostRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get('posts')
  public async getAll(): Promise<PostResponse[]> {
    return this.service.getAll();
  }

  @Get('posts/:code')
  public async getSingle(@Param('code') code: number): Promise<PostResponse> {
    return this.service.getSingle(code);
  }

  @Get('counter')
  public async getCounter(): Promise<number> {
    return this.service.getSellCounter();
  }

  @Patch('posts/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async update(@Param('code') code: number, @Body() request: PostRequest): Promise<number> {
    return this.service.update(code, request);
  }

  @Delete('posts/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('code') code: number): Promise<number> {
    return this.service.delete(code);
  }

  @Post('posts/:code/image')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@Param('code') code: number, @UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<number> {
    return this.service.setImage(code, file, res);
  }

}
