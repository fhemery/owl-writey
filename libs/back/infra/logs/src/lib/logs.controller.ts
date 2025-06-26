import { Body, Controller, HttpCode, Logger, Post } from '@nestjs/common';
import { LogRequestDto } from '@owl/shared/common/contracts';

import { LogContext } from './model/log-context';

@Controller('log')
export class LogsController {
  private readonly logger = new Logger(LogsController.name);

  @Post()
  @HttpCode(204)
  log(@Body() logRequest: LogRequestDto): void {
    const context: LogContext = { source: 'front' };
    for (const log of logRequest.logs) {
      switch (log.level) {
        case 'error':
          this.logger.error(log.message, log.stack, context);
          break;
        case 'warn':
          this.logger.warn(log.message, context);
          break;
        case 'debug':
          this.logger.debug(log.message, context);
          break;
        default:
          this.logger.log(log.message, context);
          break;
      }
    }
  }
}
