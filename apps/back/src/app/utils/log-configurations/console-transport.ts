import { format, transports } from 'winston';

export const consoleTransport = new transports.Console({
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message, ...rest }) => {
      // Convert any additional metadata to a flat string instead of JSON
      const metadata = Object.keys(rest).length
        ? Object.entries(rest)
            .map(([key, value]) => `${key}=${value}`)
            .join(' ')
        : '';
      return `${timestamp} [${level}]: ${message} ${metadata}`;
    })
  ),
});
