export interface LogDto {
  level: 'info' | 'error' | 'warn' | 'debug';
  message: string;
  stack?: string;
}

export interface LogRequestDto {
  logs: LogDto[];
}
