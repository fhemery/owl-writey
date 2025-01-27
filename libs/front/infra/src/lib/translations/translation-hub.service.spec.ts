import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

import { TranslationHubService } from './translation-hub.service';

describe('TranslationHubService', () => {
  let service: TranslationHubService;
  let translateServiceMock: Partial<TranslateService>;

  beforeEach(() => {
    translateServiceMock = {
      use: jest.fn(),
      setDefaultLang: jest.fn(),
      setTranslation: jest.fn(),
    };
    TestBed.configureTestingModule({
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    });
    service = TestBed.inject(TranslationHubService);
    localStorage.removeItem('USER_LANGUAGE');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('init', () => {
    it('should set default language', () => {
      service.init(['fr', 'en'], ['fr', 'en'], 'de');
      expect(translateServiceMock.setDefaultLang).toHaveBeenCalledWith('de');
    });

    it('should first try to load language from local storage', () => {
      localStorage.setItem('USER_LANGUAGE', 'fr');
      service.init(['en'], ['fr', 'en'], 'de');
      expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
    });

    it('should use the first language used by user browser and available', () => {
      service.init(['fr', 'en'], ['en', 'fr'], 'de');
      expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
    });

    it('should use the default language if none match', () => {
      service.init(['es', 'hu'], ['en', 'fr'], 'de');
      expect(translateServiceMock.use).toHaveBeenCalledWith('de');
    });

    it('should try to find the language without the regional part if it does not match', () => {
      service.init(['fr-CA', 'en'], ['en', 'fr'], 'de');
      expect(translateServiceMock.use).toHaveBeenCalledWith('fr');
    });
  });

  describe('loadTranslations', () => {
    it('should add the translations to the service, merging them', () => {
      const translations = {
        hello: {
          morning: 'Bonjour',
          afternoon: 'Bonjour',
        },
        goodbye: 'Au revoir',
      };
      service.loadTranslations('fr', translations);
      expect(translateServiceMock.setTranslation).toHaveBeenCalledWith(
        'fr',
        translations,
        true
      );
    });
  });
});
