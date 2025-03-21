import { uiFr } from '@owl/shared/translations';

// Type to create dot-notation path strings
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`;

type DotNestedKeys<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? // @ts-expect-error Type instantiation is excessively deep and possibly infinite
          `${K}${DotPrefix<DotNestedKeys<T[K]>>}`
        : never;
    }[keyof T]
  : '';

// Create the final type for valid translation keys
export type TranslationKey = DotNestedKeys<typeof uiFr>;

export type Translations = string | { [key: string]: Translations };
export class TestTranslator {
  private readonly translations: Record<string, Translations>;

  constructor() {
    this.translations = uiFr;
  }

  get(key: TranslationKey): string {
    const textParts = key.split('.');
    let currentTranslations = this.translations[textParts[0]];
    for (const part of textParts.slice(1)) {
      if (!currentTranslations || typeof currentTranslations === 'string') {
        return key;
      }
      currentTranslations = currentTranslations[part];
    }
    return currentTranslations.toString() || key;
  }
}
