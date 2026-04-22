import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginRequest } from '../integration/request/login.request';
import { LoginResponse } from '../integration/response/login.response';
import { AuthenticationService } from '../service/authentication.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../config/jwt-auth.guard';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private service: AuthenticationService
  ) { }

  @Post('/login')
  public async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return this.service.login(request);
  }

  @Get('/token-verify')
  @UseGuards(JwtAuthGuard)
  public async tokenVerify(): Promise<void> {}
}
