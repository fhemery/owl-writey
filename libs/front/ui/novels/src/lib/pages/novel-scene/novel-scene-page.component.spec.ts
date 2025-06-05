import { signal, WritableSignal } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { NotificationService } from '@owl/front/ui/common';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelScenePageComponent } from './novel-scene-page.component';

describe('NovelScenePageComponent', () => {
  let component: NovelScenePageComponent;
  let fixture: ComponentFixture<NovelScenePageComponent>;
  let testUtils: TestUtils;
  let mockNovelStore: Partial<NovelStore>;
  let mockNovelContext: Partial<NovelContextService>;
  let novelSignal: WritableSignal<Novel>;
  let novel: Novel;

  beforeEach(async () => {
    // Setup test novel with chapters and scenes
    novel = NovelBuilder.New('novel-1', 'Test Novel', 'aut', 'author')
      .build()
      .addChapterAt('chapter-1', 'Chapter 1')
      .addSceneAt('chapter-1', 'scene-1', 'Scene 1', 'Scene 1 content')
      .addSceneAt('chapter-1', 'scene-2', 'Scene 2', 'Scene 2 content')
      .addSceneAt('chapter-1', 'scene-3', 'Scene 3', 'Scene 3 content')
      .addChapterAt('chapter-2', 'Chapter 2')
      .addSceneAt('chapter-2', 'scene-4', 'Scene 4', 'Scene 4 content')
      .addChapterAt('chapter-3', 'Chapter 3');

    novelSignal = signal(novel);

    // Mock NovelStore
    mockNovelStore = {
      novel: novelSignal,
      updateSceneTitle: vi.fn().mockResolvedValue(undefined),
      updateSceneContent: vi.fn().mockResolvedValue(undefined),
    };

    // Mock NovelContextService
    mockNovelContext = {
      setScene: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        TranslateModule.forRoot(),
        NovelScenePageComponent,
      ],
      providers: [
        { provide: NovelStore, useValue: mockNovelStore },
        { provide: NovelContextService, useValue: mockNovelContext },
        { provide: NotificationService, useValue: { showSuccess: vi.fn() } },
        provideRouter([{ path: '**', component: NovelScenePageComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelScenePageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    testUtils.setInput(() => component.chapterId, 'chapter-1');
    testUtils.setInput(() => component.sceneId, 'scene-1', true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display', () => {
    it('should display the scene content when novel is loaded', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1', true);
      testUtils.setInput(() => component.sceneId, 'scene-1', true);
      fixture.detectChanges();

      const editor = testUtils.getElementAt('owl-text-editor');
      expect(editor).toBeTruthy();
    });
  });

  describe('Scene Operations', () => {
    beforeEach(() => {
      testUtils.setInput(() => component.chapterId, 'chapter-1', true);
      testUtils.setInput(() => component.sceneId, 'scene-1', true);
      fixture.detectChanges();
    });

    it('should update scene title', async () => {
      const newTitle = 'Updated Scene Title';
      testUtils.updateEditableField('h2.scene-page__title', newTitle);
      expect(mockNovelStore.updateSceneTitle).toHaveBeenCalledWith(
        'chapter-1',
        'scene-1',
        newTitle
      );
    });

    it('should update scene content', fakeAsync(() => {
      const newContent = 'Updated scene content';
      testUtils.updateTextEditorContent(newContent);

      tick(3000);
      expect(mockNovelStore.updateSceneContent).toHaveBeenCalledWith(
        'chapter-1',
        'scene-1',
        '<p>' + newContent + '</p>'
      );
    }));
  });

  describe('Navigation', () => {
    it('should display the previous scene link if the scene has a previous scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1');
      testUtils.setInput(() => component.sceneId, 'scene-2', true);

      expect(testUtils.hasElement('#previousSceneLink')).toBeTruthy();
    });

    it('should display the previous scene link if the scene has a next scene in the previous chapter', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-2');
      testUtils.setInput(() => component.sceneId, 'scene-4', true);

      expect(testUtils.hasElement('#previousSceneLink')).toBeTruthy();
    });

    it('should not display the previous scene link if the scene has no previous scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1');
      testUtils.setInput(() => component.sceneId, 'scene-1', true);

      expect(testUtils.hasElement('#previousSceneLink')).toBeFalsy();
    });

    it('should not display the previous scene link if the scene has no previous scene in the previous chapter', () => {
      const newNovel = novel.addChapterAt('chapter-0', 'Chapter 0', '', 0);
      novelSignal.set(newNovel);

      testUtils.setInput(() => component.chapterId, 'chapter-1');
      testUtils.setInput(() => component.sceneId, 'scene-1', true);

      expect(testUtils.hasElement('#previousSceneLink')).toBeFalsy();
    });

    it('should display the next scene link if the scene has a next scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1');
      testUtils.setInput(() => component.sceneId, 'scene-1', true);

      expect(testUtils.hasElement('#nextSceneLink')).toBeTruthy();
    });

    it('should display the next scene link if the scene has a next scene in the next chapter', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1');
      testUtils.setInput(() => component.sceneId, 'scene-3', true);

      expect(testUtils.hasElement('#nextSceneLink')).toBeTruthy();
    });

    it('should not display the next scene link if the scene has no next scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-2');
      testUtils.setInput(() => component.sceneId, 'scene-4', true);

      expect(testUtils.hasElement('#nextSceneLink')).toBeFalsy();
    });

    it('should navigate to the previous scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1', false);
      testUtils.setInput(() => component.sceneId, 'scene-2', true);

      testUtils.clickElementAt('#previousSceneLink');
      const router = TestBed.inject(Router);
      expect(router.url).toBe(
        `/novels/${novel.id}/chapters/chapter-1/scenes/scene-1`
      );
    });

    it('should navigate to the previous scene in the previous chapter', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-2', false);
      testUtils.setInput(() => component.sceneId, 'scene-4', true);

      testUtils.clickElementAt('#previousSceneLink');
      const router = TestBed.inject(Router);
      expect(router.url).toBe(
        `/novels/${novel.id}/chapters/chapter-1/scenes/scene-3`
      );
    });

    it('should navigate to the next scene', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1', true);
      testUtils.setInput(() => component.sceneId, 'scene-1', true);
      fixture.detectChanges();

      testUtils.clickElementAt('#nextSceneLink');
      const router = TestBed.inject(Router);
      expect(router.url).toBe(
        `/novels/${novel.id}/chapters/chapter-1/scenes/scene-2`
      );
    });

    it('should navigate to the next scene in the next chapter', () => {
      testUtils.setInput(() => component.chapterId, 'chapter-1', true);
      testUtils.setInput(() => component.sceneId, 'scene-3', true);

      testUtils.clickElementAt('#nextSceneLink');
      const router = TestBed.inject(Router);
      expect(router.url).toBe(
        `/novels/${novel.id}/chapters/chapter-2/scenes/scene-4`
      );
    });
  });
});
