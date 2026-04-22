import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from "../../../authentication/config/jwt-auth.guard";
import { CityRequest } from "../integration/request/city.request";
import { CityService } from "../service/city.service";
import { CityResponse } from "../integration/response/city.response";
import { NeighborhoodResponse } from 'src/locality/neighborhood/integration/response/neighborhood.response';

@Controller('locality/city')
export class CityController {
  constructor(
    private service: CityService
  ) {
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: CityRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get()
  public async getAll(): Promise<CityResponse[]> {
    return this.service.getAll();
  }

  @Get(':code/neighborhoods')
  public async getNeightborhoods(@Param('code') code: number): Promise<NeighborhoodResponse[]> {
    return this.service.getNeighborhoods(code);
  }

  @Get(':code')
  public async getSingle(@Param('code') code: number): Promise<CityResponse> {
    return this.service.getSingle(code);
  }

  @Patch(':code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async update(@Param('code') code: number, @Body() request: CityRequest): Promise<number> {
    return this.service.update(code, request);
  }

  @Delete(':code')
  @UseGuards(JwtAuthGuard)
  public async delete(@Param('code') code: number): Promise<number> {
    return this.service.delete(code);
  }
}
