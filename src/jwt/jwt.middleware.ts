import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

// class type
// export class JwtMiddleware implements NestMiddleware {
//   // res , req, nextの順番が重要
//   use(req: Request, res: Response, next: NextFunction) {
//     console.log(req.headers);
//     next();
//   }
// }

// funtion type
export function JwtMiddleware(req: Request, res: Response, next: NextFunction) {
  console.log(req.headers);
  next();
}
