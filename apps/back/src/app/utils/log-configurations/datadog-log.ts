import TransportStream from 'winston-transport';
// Direct Datadog transport implementation

// Custom transport that directly uses fetch for better control
export class DirectDatadogTransport extends TransportStream {
  private apiKey: string;
  private url: string;
  private hostname: string;
  private service: string;
  private env: string;
  private batchMode: boolean;
  private batchInterval: number;
  private logQueue: Record<string, unknown>[] = [];
  private timer: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.apiKey = process.env['DATADOG_API_KEY'] || '';
    this.hostname =
      process.env['BASE_API_URL']?.replace(/https?:\/\//, '') || 'localhost';
    this.service = 'Owl-writey-app';
    this.env = process.env['API_ENV'] || 'local';
    this.url = `https://http-intake.logs.datadoghq.eu/api/v2/logs`;
    this.batchMode = true;
    this.batchInterval = 5000;

    if (this.batchMode) {
      this.timer = setInterval(() => this.flushLogs(), this.batchInterval);
    }
  }

  log(info: Record<string, any>, callback: () => void): void {
    // Emit logged event for Winston
    setImmediate(() => {
      this.emit('logged', info);
    });

    // Format log for Datadog
    const logEntry = {
      message: info.message,
      level: info.level,
      ddsource: 'nodejs',
      service: this.service,
      hostname: this.hostname,
      ddtags: `env:${this.env}`,
      ...info,
    };

    if (this.batchMode) {
      this.logQueue.push(logEntry);
      if (!this.batchMode) {
        void this.flushLogs();
      }
    } else {
      void this.sendLogs([logEntry]);
    }

    callback();
  }

  private async flushLogs(): Promise<void> {
    if (this.logQueue.length === 0) return;

    const logs = [...this.logQueue];
    this.logQueue = [];
    void this.sendLogs(logs);
  }

  private async sendLogs(logs: Record<string, unknown>[]): Promise<void> {
    if (!this.apiKey) {
      console.error('No Datadog API key provided');
      return;
    }

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'DD-API-KEY': this.apiKey,
        },
        body: JSON.stringify(logs),
      });

      if (!response.ok) {
        console.error(`Datadog API error (${response.status})`);
      }
    } catch (error) {
      console.error('Error sending logs to Datadog:', error);
    }
  }
}
