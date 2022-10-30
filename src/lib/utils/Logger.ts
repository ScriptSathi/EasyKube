import * as winston from 'winston';
import * as path from 'path';

const { combine, timestamp, label, printf } = winston.format;

/* eslint-disable-next-line  @typescript-eslint/no-shadow */
const customFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
    level: 'info',
    format: combine(
        
        label({ label: path.relative(process.cwd(), require.main?.filename || __filename) }),
        timestamp({
            format: new Date().toISOString()
                .replace(/T/, ' ')
                .replace(/\..+/, ''),
        }),
        customFormat,
    ),
    defaultMeta: { service: 'user-service' },
    transports: [new winston.transports.Console()],
});
