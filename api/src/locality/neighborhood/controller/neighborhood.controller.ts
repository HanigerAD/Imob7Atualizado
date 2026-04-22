import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';

import { JwtAuthGuard } from '../../../authentication/config/jwt-auth.guard';
import { NeighborhoodRequest } from '../integration/request/neighborhood.request';
import { NeighborhoodResponse } from '../integration/response/neighborhood.response';
import { NeighborhoodService } from '../service/neighborhood.service';
import { PaginationDTO } from './../../../common/dto/pagination.dto';

@Controller('neighborhood')
export class NeighborhoodController {
  constructor(
    private service: NeighborhoodService
  ) {
  }

  @Post('neighborhoods')
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: NeighborhoodRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get('neighborhoods')
  public async getAll(@Query() pagination: PaginationDTO, @Res() res: Response): Promise<void> {
    res.send(await this.service.getAll(pagination, res));
  }

  @Get('neighborhoods/:code')
  public async getSingle(@Param('code') code: number): Promise<NeighborhoodResponse> {
    return this.service.getSingle(code);
  }

  @Patch('neighborhoods/:code')
  @UseGuards(JwtAuthGuard)
  public async update(@Param('code') code: number, @Body() request: NeighborhoodRequest): Promise<number> {
    return this.service.update(code, request);
  }

  @Delete('neighborhoods/:code')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('code') code: number): Promise<number> {
    return this.service.delete(code);
  }
}