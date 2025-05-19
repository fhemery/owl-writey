import { format, transports } from 'winston';

export const fileLog = new transports.File({
  dirname: process.env['OWL_LOG_PATH'] || './',
  filename: 'owl-writey-back.log',
  level: 'info',
  format: format.simple(),
  maxsize: 5 * 1024 * 1024,
});
