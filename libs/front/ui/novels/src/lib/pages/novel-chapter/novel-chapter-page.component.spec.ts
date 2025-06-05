import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import {
  ConfirmDialogService,
  NotificationService,
} from '@owl/front/ui/common';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelChapterPageComponent } from './novel-chapter-page.component';

describe('NovelChapterPageComponent', () => {
  let component: NovelChapterPageComponent;
  let fixture: ComponentFixture<NovelChapterPageComponent>;
  let testUtils: TestUtils;
  let mockNovelStore: Partial<NovelStore>;
  let mockNovelContext: Partial<NovelContextService>;
  let novelSignal: WritableSignal<Novel | null>;
  let novel: Novel;

  beforeEach(() => {
    novel = NovelBuilder.New('novel-1', 'Test Novel', 'aut', 'author')
      .build()
      .addChapterAt('chapter-1', 'Chapter 1')
      .addSceneAt('chapter-1', 'scene-1', 'Scene 1', 'Scene 1 outline')
      .addSceneAt('chapter-1', 'scene-2', 'Scene 2')
      .addChapterAt('chapter-2', 'Chapter 2')
      .addChapterAt('chapter-3', 'Chapter 3');
    novelSignal = signal(novel);

    mockNovelStore = {
      novel: novelSignal,
      updateChapterTitle: vi.fn(),
      updateSceneTitle: vi.fn(),
      updateSceneOutline: vi.fn(),
      updateScenePov: vi.fn(),
      moveScene: vi.fn(),
    };

    mockNovelContext = {
      setChapter: vi.fn(),
    };
  });

  const mockDialog = {
    open: vi.fn(),
  };

  const mockConfirmDialogService = {
    confirm: vi.fn(),
  };

  const mockNotificationService = {
    success: vi.fn(),
    error: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NovelChapterPageComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        MatDialogModule,
      ],
      providers: [
        { provide: NovelStore, useValue: mockNovelStore },
        { provide: NovelContextService, useValue: mockNovelContext },
        { provide: MatDialog, useValue: mockDialog },
        { provide: ConfirmDialogService, useValue: mockConfirmDialogService },
        { provide: NotificationService, useValue: mockNotificationService },
        provideRouter([
          {
            path: '**',
            component: NovelChapterPageComponent,
          },
        ]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelChapterPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);

    testUtils.setInput(() => component.chapterId, 'chapter-1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display', () => {
    it('should not display if the novel is not loaded', () => {
      novelSignal.set(null);
      fixture.detectChanges();
      expect(testUtils.hasElement('owl-novel-chapter-header')).toBeFalsy();
      expect(testUtils.hasElement('owl-novel-chapter-scenes')).toBeFalsy();
    });

    it('should display the header and the chapter scenes if novel is loaded', () => {
      expect(testUtils.hasElement('owl-novel-chapter-header')).toBeTruthy();
      expect(testUtils.hasElement('owl-novel-chapter-scenes')).toBeTruthy();
    });

    describe('Regarding header', () => {
      it('should display the chapter title', () => {
        expect(testUtils.getTextForElementAt('h2')).toBe('Chapter 1');
      });

      it('should emit an event to the store if chapter title changes', () => {
        const newChapterTitle = 'Chapter 1, revised';
        testUtils.updateEditableField('h2', newChapterTitle);
        expect(mockNovelStore.updateChapterTitle).toHaveBeenCalledWith(
          'chapter-1',
          newChapterTitle
        );
      });

      it('should display forward navigation arrow if chapter is not the last one', () => {
        expect(testUtils.hasElement('#nextChapterLink')).toBeTruthy();
      });

      it('should not display forward navigation arrow if chapter is the last one', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-3', true);
        expect(testUtils.hasElement('#nextChapterLink')).toBeFalsy();
      });

      it('should display back navigation arrow if chapter is not the first one', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-2', true);
        expect(testUtils.hasElement('#previousChapterLink')).toBeTruthy();
      });

      it('should not display back navigation arrow if chapter is the first one', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-1', true);
        expect(testUtils.hasElement('#previousChapterLink')).toBeFalsy();
      });

      it('should navigate to the previous chapter if previous chapter link is clicked', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-2', true);
        testUtils.clickElementAt('#previousChapterLink');
        const router = TestBed.inject(Router);
        expect(router.url).toBe(`/novels/${novel.id}/chapters/chapter-1`);
      });

      it('should navigate to the next chapter if next chapter link is clicked', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-2', true);
        testUtils.clickElementAt('#nextChapterLink');
        const router = TestBed.inject(Router);
        expect(router.url).toBe(`/novels/${novel.id}/chapters/chapter-3`);
      });
    });

    describe('Regarding scenes', () => {
      it('should display the scenes', () => {
        testUtils.setInput(() => component.chapterId, 'chapter-1', true);
        expect(testUtils.getNbElements('owl-novel-scene-card')).toBe(2);
      });

      describe('Regarding scene title', () => {
        it('should display the scene title', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils.getTextForElementAt(
              'owl-novel-scene-card .chapter-scene__title'
            )
          ).toBe('Scene 1');
        });

        it('should update the scene title if it changes', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.updateEditableField(
            'owl-novel-scene-card .chapter-scene__title',
            'Scene 1, revised'
          );
          expect(mockNovelStore.updateSceneTitle).toHaveBeenCalledWith(
            'chapter-1',
            'scene-1',
            'Scene 1, revised'
          );
        });
      });

      describe('Regarding scene POV', () => {
        it('should display no POV if none is selected', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils.hasElement(
              'owl-novel-scene-card .chapter-scene__details--pov mat-icon.no-pov'
            )
          ).toBeTruthy();
        });

        it('should not display a border if none is selected', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils
              .getElementAt('owl-novel-scene-card .chapter-scene')
              .getAttribute('style')
          ).toBeNull();
        });

        it('should display the POV if one is selected', () => {
          const newNovel = novel
            .addCharacterAt('alice', 'Alice', '')
            .updateScenePov('chapter-1', 'scene-1', 'alice');
          novelSignal.set(newNovel);
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils.getTextForElementAt(
              'owl-novel-scene-card .chapter-scene__details--pov'
            )
          ).toContain('Alice');
        });

        it('should by default use black color', () => {
          const newNovel = novel
            .addCharacterAt('alice', 'Alice', 'red')
            .updateScenePov('chapter-1', 'scene-1', 'alice');

          novelSignal.set(newNovel);
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils
              .getElementAt('owl-novel-scene-card .chapter-scene__details--pov')
              .getAttribute('style')
          ).toContain('color: black');
          expect(
            testUtils
              .getElementAt('owl-novel-scene-card .chapter-scene')
              .getAttribute('style')
          ).toContain('border: 1px solid black');
        });

        it('should use the correct color for POV if defined', () => {
          let newNovel = novel
            .addCharacterAt('alice', 'Alice', 'red')
            .updateScenePov('chapter-1', 'scene-1', 'alice');
          const alice = newNovel.findCharacter('alice');
          if (!alice) {
            expect.fail('character not found');
          }
          newNovel = newNovel.updateCharacter(alice.withColor('red'));

          novelSignal.set(newNovel);
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils
              .getElementAt('owl-novel-scene-card .chapter-scene__details--pov')
              .getAttribute('style')
          ).toContain('color: red');
          expect(
            testUtils
              .getElementAt('owl-novel-scene-card .chapter-scene')
              .getAttribute('style')
          ).toContain('border: 1px solid red');
        });
      });

      describe('Regarding scene outline', () => {
        it('should display the scene outline', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          expect(
            testUtils.getTextForElementAt(
              'owl-novel-scene-card .chapter-scene__outline'
            )
          ).toBe('Scene 1 outline');
        });

        it('should update the scene outline if it changes', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.updateEditableField(
            'owl-novel-scene-card .chapter-scene__outline',
            'Scene 1 outline, revised'
          );
          expect(mockNovelStore.updateSceneOutline).toHaveBeenCalledWith(
            'chapter-1',
            'scene-1',
            'Scene 1 outline, revised'
          );
        });
      });

      describe('Regarding number of words', () => {
        it('should display the number of words', () => {
          const scene = novel.findScene('chapter-1', 'scene-1');
          if (!scene) {
            expect.fail('scene not found');
          }
          const newNovel = novel.updateScene(
            'chapter-1',
            scene.withContent('hello')
          );
          novelSignal.set(newNovel);

          testUtils.setInput(() => component.chapterId, 'chapter-1', true);

          expect(
            testUtils.getTextForElementAt('.chapter-scene__details--words')
          ).toContain(1);
        });
      });

      describe('Regarding scene move', () => {
        it('should move the scene up if move up button is clicked', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.clickElementAt(
            'owl-novel-scene-card .chapter-scene__action--move-up',
            1
          );

          expect(mockNovelStore.moveScene).toHaveBeenCalledWith(
            'chapter-1',
            'scene-2',
            0
          );
        });

        it('should move the scene down if move down button is clicked', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.clickElementAt(
            'owl-novel-scene-card .chapter-scene__action--move-down',
            0
          );
          expect(mockNovelStore.moveScene).toHaveBeenCalledWith(
            'chapter-1',
            'scene-1',
            1
          );
        });
      });

      describe('Regarding navigation', () => {
        it('should navigate to the scene if scene card is double-clicked', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.doubleClickElementAt('owl-novel-scene-card .chapter-scene');
          const router = TestBed.inject(Router);
          expect(router.url).toBe(
            `/novels/${novel.id}/chapters/chapter-1/scenes/scene-1`
          );
        });

        it('should navigate to the scene if scene goto button is clicked', () => {
          testUtils.setInput(() => component.chapterId, 'chapter-1', true);
          testUtils.clickElementAt(
            'owl-novel-scene-card .chapter-scene__action--go'
          );
          const router = TestBed.inject(Router);
          expect(router.url).toBe(
            `/novels/${novel.id}/chapters/chapter-1/scenes/scene-1`
          );
        });
      });
    });
  });
});
