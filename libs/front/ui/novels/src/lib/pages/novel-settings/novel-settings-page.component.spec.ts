import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelSettingsPageComponent } from './novel-settings-page.component';

describe('NovelSettingsPageComponent', () => {
  let component: NovelSettingsPageComponent;
  let fixture: ComponentFixture<NovelSettingsPageComponent>;
  let testUtils: TestUtils;
  let novel: WritableSignal<Novel | null>;

  beforeEach(async () => {
    novel = signal(
      NovelBuilder.New('test', 'test', 'authorId', 'authorName').build()
    );
    await TestBed.configureTestingModule({
      imports: [NovelSettingsPageComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        NovelContextService,
        {
          provide: NovelStore,
          useValue: {
            novel,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelSettingsPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    it('should display the page', () => {
      expect(testUtils.hasElement('.novel-settings-page')).toBeTruthy();
    });

    it('should display the general information tab', () => {
      expect(
        testUtils.hasText('novel.settings.tab.generalInfo', '.settings-tab')
      ).toBeTruthy();
    });

    it('should display the export tab', () => {
      expect(
        testUtils.hasText('novel.settings.tab.export', '.settings-tab', 1)
      ).toBeTruthy();
    });
  });
});
