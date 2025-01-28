import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Translations } from './model/translations';

@Injectable({
  providedIn: 'root',
})
export class TranslationHubService {
  private readonly translateService = inject(TranslateService);

  init(
    browserLanguages: readonly string[],
    availableLanguages: string[],
    defaultLanguage: string
  ): void {
    this.translateService.setDefaultLang(defaultLanguage);

    const languageToUse = this.determineLanguage(
      browserLanguages,
      availableLanguages
    );
    this.translateService.use(languageToUse || defaultLanguage);
  }

  loadTranslations(language: string, translations: Translations): void {
    this.translateService.setTranslation(language, translations, true);
  }

  private determineLanguage(
    browserLanguages: readonly string[],
    availableLanguages: string[]
  ): string | null {
    return (
      this.tryFromLocalStorage(availableLanguages) ||
      this.findInBrowserLanguages(browserLanguages, availableLanguages)
    );
  }

  private findInBrowserLanguages(
    browserLanguages: readonly string[],
    availableLanguages: string[]
  ): string | null {
    for (const lang of browserLanguages) {
      if (availableLanguages.includes(lang)) {
        return lang;
      }
      if (lang.includes('-')) {
        const langWithoutRegion = lang.split('-')[0];
        if (availableLanguages.includes(langWithoutRegion)) {
          return langWithoutRegion;
        }
      }
    }
    return null;
  }

  private tryFromLocalStorage(availableLanguages: string[]): string | null {
    const userLanguage = localStorage.getItem('USER_LANGUAGE');
    if (userLanguage && availableLanguages.includes(userLanguage)) {
      this.translateService.use(userLanguage);
      return userLanguage;
    }
    return null;
  }
}
