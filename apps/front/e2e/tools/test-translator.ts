import { uiFr } from '@owl/shared/translations';

export type Translations = string | { [key: string]: Translations };
export class TestTranslator {
  private readonly translations: Record<string, Translations>;

  constructor() {
    this.translations = uiFr;
  }

  get(text: string): string {
    const textParts = text.split('.');
    let currentTranslations = this.translations[textParts[0]];
    for (const part of textParts.slice(1)) {
      if (!currentTranslations || typeof currentTranslations === 'string') {
        return text;
      }
      currentTranslations = currentTranslations[part];
    }
    return currentTranslations.toString() || text;
  }
}
