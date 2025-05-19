import TransportStream from 'winston-transport';

import { consoleTransport } from './log-configurations/console-transport';
import { DirectDatadogTransport } from './log-configurations/datadog-log';
import { fileLog } from './log-configurations/file-log';

export function getLogConfiguration(): TransportStream[] {
  // Create console transport with colors for better readability

  // Check if Datadog logging is enabled
  if (process.env['DATADOG_ENABLED']?.toString() === '1') {
    return [new DirectDatadogTransport(), consoleTransport, fileLog];
  } else {
    return [consoleTransport, fileLog];
  }
}
