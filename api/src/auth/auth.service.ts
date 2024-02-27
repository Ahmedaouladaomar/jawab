import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && user.password === pass) {
      if(user.isActive){
        const { password, ...result } = user;
        return result;
      } else {
        // not verified account
        return { requireVerification: true, id: user.id };
      }
    }
    return null;
  }

  async login(user: any) {
    const res = await this.validateUser(user.username, user.password);
    if(!res) return null;
    if(res.requireVerification) return res;
    const payload = { user: res };
    return this.jwtService.sign(payload);
  }

  async signup(username: any) {
    const user = await this.usersService.findOneByUsername(username);
    const payload = { user: user };
    
    return this.jwtService.sign(payload);
  }

  validate(token: string) {
    let cred = null;
    try { 
      cred = this.jwtService.verify(token);
    } catch (err){
      return null
    }
    return cred;
  }

  validateRequest(request: any) {
    let token = this.extractTokenFromHeadersCookie(request.headers.cookie);
    return this.validate(token);
  }

  extractTokenFromHeadersCookie(cookie: string): string{
    let cookies_array = cookie.split('; ');
    let token = null;
    cookies_array.map((item) => {
      let cookie_details = item.split('=');
      if(cookie_details[0] == 'access_token'){
        token = cookie_details[1];
      }
    })
    return token
  }
}