import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class PingController {
  @Get()
  ping(): Promise<{ status: string }> {
    return Promise.resolve({ status: 'ok' });
  }
}
