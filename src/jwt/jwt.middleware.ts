import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { JwtService } from './jwt.service';

// class type
@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  // req , res, nextの順番が重要
  async use(req: Request, res: Response, next: NextFunction) {
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decode = this.jwtService.verify(String(token));
        if (typeof decode === 'object' && decode.hasOwnProperty('id')) {
          const user = await this.userService.findById(decode['id']);
          req['user'] = user; //requestにuserを入れて送る。
        }
      } catch (error) {
        console.log(error);
      }
    }
    next(); //next handlerがuserをもらう。
  }
}

// funtion type
// export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
//   console.log(req.headers);
//   next();
// }
