import { signal, WritableSignal } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
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
      .addChapterAt('chapter-2', 'Chapter 2');

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
        provideRouter([]), // Required for router-outlet
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
});
