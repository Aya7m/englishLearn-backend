import { JwtModuleOptions } from '@nestjs/jwt';
import { JWT_SECRET } from './constants';

export const jwtConfig: JwtModuleOptions = {
  secret:JWT_SECRET,
  signOptions: {
    expiresIn: '7d',
  },
};