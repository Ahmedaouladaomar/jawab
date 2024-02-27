import { Controller, Request, Post, Get, UseGuards, Res, Body, Param, UnauthorizedException } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { Response } from 'express';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { UsersService } from './users/users.service';
import { CreateUserDto } from './users/dto/create-user.dto';

@Controller()
export class AppController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const token = await this.authService.login(req.body);
    if(!token) throw new UnauthorizedException();
    if(token.requireVerification) return token;
    // setting httpOnly cookie
    response.cookie('access_token', token, {
      httpOnly: true,
      secure: false,
      maxAge: 31536000
    });
    const cred = await this.authService.validate(token);
    return { user: cred.user }
  }

  @Post('/register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @Post('/regenerateVerification/:id')
  async regenerateVerification(@Param('id') id: any, @Res() response: Response){
    const res = await this.usersService.generateVerificationCode(+id);
    if(!res) throw new UnauthorizedException();
    else response.sendStatus(200);
  }

  @Post('/verifyEmail/:uid/:code')
  async verifyEmail(@Param() params: any, @Res({ passthrough: true }) response: Response) {
    const { uid, code } = params;
    let user = await this.usersService.verifyEmail(+uid, +code);
    if(!user){
      throw new UnauthorizedException();
    } else {
      // resetting fields related to register process 
      user = { ...user, isActive: true, verificationCode: null, verificationCodeExpireDate: null };
      const { id, ...data } = user;
      await this.usersService.update(id, data);
      // generating token
      const token = await this.authService.signup(user.username);
      // setting httpOnly cookie
      response.cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 31536000
      });
      return { user: user }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  async auth(@Request() req: any) {
    const token = req.cookies.access_token;
    const cred = await this.authService.validate(token);
    const { id } = cred.user;
    const user = await this.usersService.findOne(id);
    return { user: user };
  }

  @UseGuards(JwtAuthGuard)
  @Get('/logout')
  logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
  }
}
