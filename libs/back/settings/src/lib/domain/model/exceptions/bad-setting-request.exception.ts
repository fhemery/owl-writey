export class BadSettingRequestException extends Error {
  constructor(message: string) {
    super('Bad setting request: ' + message);
  }
}
