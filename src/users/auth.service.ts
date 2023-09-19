import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersSevice: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersSevice.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    //genetate salt
    const salt = randomBytes(8).toString('hex');
    //hash password with salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    //join password with salt]
    const result = salt + '.' + hash.toString('hex');

    const user = await this.usersSevice.create(email, result);

    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersSevice.find(email);
    console.log(user);
    if (!user) {
      throw new NotFoundException('User Not found');
    }
    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return user;
  }
}
