export class BadSettingException extends Error {
  constructor(message: string) {
    super('Bad setting: ' + message);
  }
}
