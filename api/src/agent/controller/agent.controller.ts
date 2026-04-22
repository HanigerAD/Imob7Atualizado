import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AgentService } from "../service/agent.service";
import { AgentRequest } from "../integration/request/agent.request";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { AgentResponse } from "../integration/response/agent.response";
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('agent')
export class AgentController {
  constructor(
    private service: AgentService
  ) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: AgentRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get()
  public async getAll(): Promise<AgentResponse[]> {
    return this.service.getAll();
  }

  @Get(':code')
  @UseGuards(JwtAuthGuard)
  public async getSingle(@Param('code') code: number): Promise<AgentResponse> {
    return this.service.getSingle(code);
  }

  @Patch(':code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async update(@Param('code') code: number, @Body() request: AgentRequest): Promise<number> {
    return this.service.update(code, request);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('code') code: number): Promise<number> {
    return this.service.delete(code);
  }

  @Post(':code/image')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(@Param('code') code: number, @UploadedFile() file: Express.Multer.File, @Res() res: Response): Promise<number> {
    return this.service.setImage(code, file, res);
  }
}
