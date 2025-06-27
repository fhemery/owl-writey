import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ComponentFixture } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelOverviewPageComponent } from './novel-overview-page.component';

describe('NovelOverviewPageComponent', () => {
  let component: NovelOverviewPageComponent;
  let fixture: ComponentFixture<NovelOverviewPageComponent>;
  let testUtils: TestUtils;

  let novelStore: Partial<NovelStore>;
  let novel: WritableSignal<Novel | null>;

  beforeEach(() => {
    novel = signal(null);
    novelStore = {
      moveChapter: vi.fn(),
      novel,
    };
    TestBed.configureTestingModule({
      imports: [NovelOverviewPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: NovelStore, useValue: novelStore }],
    });
    fixture = TestBed.createComponent(NovelOverviewPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('about chapter cards', () => {
    beforeEach(() => {
      novel.set(
        NovelBuilder.New('Test novel', 'Description', 'author', 'author')
          .build()
          .addChapterAt('chapter-1', 'Chapter 1')
          .addChapterAt('chapter-2', 'Chapter 2')
      );
      fixture.detectChanges();
    });

    it('should display the about chapter cards', () => {
      expect(testUtils.getNbElements('owl-novel-overview-chapter-card')).toBe(
        2
      );
    });

    describe('When moving them around', () => {
      it('should move chapters backwards', () => {
        testUtils.clickElementAt('.chapter-card__action--move-up', 1);

        expect(novelStore.moveChapter).toHaveBeenCalledWith(1, 0);
      });

      it('should move chapters forwards', () => {
        testUtils.clickElementAt('.chapter-card__action--move-down', 0);

        expect(novelStore.moveChapter).toHaveBeenCalledWith(0, 2);
      });
    });
  });
});
