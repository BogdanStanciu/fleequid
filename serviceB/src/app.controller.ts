import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('get-test')
  async getFlow(): Promise<void> {
    return this.appService.getFlowTest();
  }

  @Get('insert-test')
  async insertFlow(): Promise<void> {
    return this.appService.insertFlowTest();
  }
}
