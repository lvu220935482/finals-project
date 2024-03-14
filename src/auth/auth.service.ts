import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async validateUser(username: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOneByUsername(username)).content
      .data;
    if (user) {
      const isValid = await this.usersService.isValidPassword(
        pass,
        user.password,
      );
      if (isValid) {
        return user;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, id: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
