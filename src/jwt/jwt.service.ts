import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtService {
  hello() {
    return 'Hello';
  }
}
