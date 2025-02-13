import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  healtz(): string {
    return 'ok';
  }
}
