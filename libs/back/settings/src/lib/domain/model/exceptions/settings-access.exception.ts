export class SettingsAccessDeniedException extends Error {
  constructor() {
    super('Settings access denied');
  }
}
