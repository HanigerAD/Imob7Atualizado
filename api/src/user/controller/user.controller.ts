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
  Query,
  UseGuards
} from '@nestjs/common';
import { Observable } from "rxjs";
import { UserService } from "../service/user.service";
import { UserRequest } from "../integration/request/user.request";
import { UserResponse } from "../integration/response/user.response";
import { JwtAuthGuard } from "../../authentication/config/jwt-auth.guard";
import { PasswordRequest } from "../integration/request/password.request";
import { UserDto } from "../DTO/userDto";
import { PermissionResponse } from "../integration/response/permission.response";
import { SituationResponse } from '../integration/response/situation.response';

@Controller('user')
export class UserController {
  constructor(
    private service: UserService
  ) {
  }

  @Post('users')
  @UseGuards(JwtAuthGuard)
  public async insert(@Body() request: UserRequest): Promise<number> {
    return this.service.insert(request);
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  public getAll(@Query() filter: UserDto): Observable<UserResponse[]> {
    return this.service.getAll(filter);
  }

  @Get('permissions')
  @UseGuards(JwtAuthGuard)
  public async getPermissions(): Promise<PermissionResponse[]> {
    return this.service.getPermissions();
  }

  @Get('situations')
  @UseGuards(JwtAuthGuard)
  public async getSituations(): Promise<SituationResponse[]> {
    return this.service.getSituations();
  }

  @Get('permissions/:code')
  @UseGuards(JwtAuthGuard)
  public async getUserPermissions(@Param('code') code: number): Promise<PermissionResponse[]> {
    return this.service.getUserPermissions(code);
  }

  @Get('users/:code')
  @UseGuards(JwtAuthGuard)
  public async getSingle(@Param('code') code: number): Promise<UserResponse> {
    return this.service.getSingle(code);
  }

  @Patch('users/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async update(@Param('code') code: number, @Body() request: UserRequest): Promise<number> {
    return this.service.update(code, request);
  }

  @Patch('users/:code/update-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public updatePassword(@Param('code') code: number, @Body() password: PasswordRequest): Observable<number> {
    return this.service.updatePassword(code, password);
  }

  @Delete('users/:code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  public async delete(@Param('code') code: number): Promise<number> {
    return this.service.delete(code);
  }

  @Get('counter')
  @UseGuards(JwtAuthGuard)
  public async getCounter(): Promise<number> {
    return this.service.getUserCounter();
  }

}
