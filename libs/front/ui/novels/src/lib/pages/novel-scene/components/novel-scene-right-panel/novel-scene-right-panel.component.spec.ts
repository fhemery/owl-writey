import { WritableSignal } from '@angular/core';
import { signal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../../../services/novel.store';
import { NovelScenePageViewModel } from '../../view-model/novel-scene-page-view-model';
import { NovelSceneRightPanelComponent } from './novel-scene-right-panel.component';

describe('NovelSceneRightPanelComponent', () => {
  let component: NovelSceneRightPanelComponent;
  let fixture: ComponentFixture<NovelSceneRightPanelComponent>;
  let testUtils: TestUtils;
  let novel: WritableSignal<Novel | null>;
  let fakeNovelStore: Partial<NovelStore>;

  beforeEach(() => {
    novel = signal(generateNovel());
    fakeNovelStore = {
      novel,
      updateSceneOutline: vi.fn().mockResolvedValue(true),
      updateSceneNotes: vi.fn().mockResolvedValue(true),
    };
    TestBed.configureTestingModule({
      imports: [NovelSceneRightPanelComponent, TranslateModule.forRoot()],
      providers: [{ provide: NovelStore, useValue: fakeNovelStore }],
    });
    fixture = TestBed.createComponent(NovelSceneRightPanelComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    testUtils.setInput(
      () => component.data,
      NovelScenePageViewModel.From('chapter-1', 'scene-1', novel())
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasElement('.scene-right-panel')).toBe(true);
  });

  describe('regarding POV', () => {
    it('should display the POV selector', () => {
      expect(testUtils.hasElement('.no-pov')).toBe(true);
    });

    it('should display the POV if it exists', () => {
      novel.update(
        (n) => n?.updateScenePov('chapter-1', 'scene-1', 'alice') || null
      );
      testUtils.setInput(
        () => component.data,
        NovelScenePageViewModel.From('chapter-1', 'scene-1', novel()),
        true
      );

      expect(testUtils.hasElement('.no-pov')).toBe(false);
      expect(testUtils.getTextForElementAt('.novel-pov a span')).toBe('Alice');
    });
  });

  describe('regarding outline', () => {
    it('should display the outline', () => {
      expect(testUtils.hasElement('.scene-right-panel__outline')).toBe(true);
      expect(
        testUtils.getEditableFieldContent('.scene-right-panel__outline')
      ).toContain('Scene 1 outline');
    });

    it('should update the outline when the user changes it', () => {
      testUtils.updateEditableField(
        '.scene-right-panel__outline .scene-right-panel__editable',
        'New outline'
      );

      expect(fakeNovelStore.updateSceneOutline).toHaveBeenCalledWith(
        'chapter-1',
        'scene-1',
        'New outline'
      );
    });
  });

  describe('regarding notes', () => {
    it('should display the notes', () => {
      const actualScene = novel()?.findScene('chapter-1', 'scene-1');
      if (!actualScene) {
        throw new Error('Scene not found');
      }
      novel.update(
        (n) =>
          n?.updateScene('chapter-1', actualScene.withNotes('Initial notes')) ||
          null
      );
      testUtils.setInput(
        () => component.data,
        NovelScenePageViewModel.From('chapter-1', 'scene-1', novel()),
        true
      );

      expect(testUtils.hasElement('.scene-right-panel__notes')).toBe(true);
      expect(
        testUtils.getEditableFieldContent('.scene-right-panel__notes')
      ).toContain('Initial notes');
    });

    it('should update the notes when the user changes it', () => {
      testUtils.updateEditableField(
        '.scene-right-panel__notes .scene-right-panel__editable',
        'New notes'
      );

      expect(fakeNovelStore.updateSceneNotes).toHaveBeenCalledWith(
        'chapter-1',
        'scene-1',
        'New notes'
      );
    });
  });
});

function generateNovel(): Novel {
  return NovelBuilder.New('title', 'description', 'authorId', 'authorName')
    .build()
    .addChapterAt('chapter-1', 'Chapter 1')
    .addSceneAt('chapter-1', 'scene-1', 'Scene 1', 'Scene 1 outline')
    .addCharacterAt('alice', 'Alice', 'Alice description');
}
