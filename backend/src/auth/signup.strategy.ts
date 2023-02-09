import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { validate, Length } from 'class-validator';

@Injectable()
export class SignupStrategy extends PassportStrategy(Strategy, 'signup') {
  constructor(private authService: AuthService) {
    super({
      passReqToCallback: true
    });
  }

  async validate(req, _username: string, _password: string): Promise<any> {
    let signupDto = new SignupDto();
    signupDto.username = req.body.username;
    signupDto.password = req.body.password;
    let errors = await validate(signupDto);
    if (errors.length > 0) {
      throw new BadRequestException();
    }

    const user = await this.authService.createUser(signupDto.username, signupDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}