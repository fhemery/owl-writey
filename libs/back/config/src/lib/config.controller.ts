import { Controller, Get } from '@nestjs/common';
import { ConfigurationDto } from '@owl/shared/common/contracts';

@Controller('config')
export class ConfigController {
  @Get()
  getConfiguration(): Promise<ConfigurationDto> {
    return Promise.resolve({
      baseUrl: process.env['BASE_API_URL'] || 'http://localhost:3000',
    });
  }
}
