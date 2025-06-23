import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelCharactersPageComponent } from './novel-characters-page.component';

describe('NovelCharactersPageComponent', () => {
  let component: NovelCharactersPageComponent;
  let fixture: ComponentFixture<NovelCharactersPageComponent>;
  let testUtils: TestUtils;
  let mockNovelStore: Partial<NovelStore>;
  let novel: WritableSignal<Novel | null>;

  beforeEach(() => {
    novel = signal(null);
    mockNovelStore = {
      novel,
      moveCharacter: vi.fn(),
    };
    TestBed.configureTestingModule({
      imports: [NovelCharactersPageComponent, TranslateModule.forRoot()],
      providers: [{ provide: NovelStore, useValue: mockNovelStore }],
    });
    fixture = TestBed.createComponent(NovelCharactersPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  beforeEach(() => {
    novel.set(
      NovelBuilder.New('novel-1', 'Test Novel', 'aut', 'author')
        .build()
        .addCharacterAt('character-1', 'Character 1', 'c1')
        .addCharacterAt('character-2', 'Character 2', 'c2')
        .addCharacterAt('character-3', 'Character 3', 'c3')
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display all the characters', () => {
    expect(testUtils.getNbElements('owl-novel-character-card')).toBe(3);
  });

  describe('Moving up and down', () => {
    it('should work when moving a character up', () => {
      testUtils.clickElementAt('.character-card__action--move-up', 1);
      expect(mockNovelStore.moveCharacter).toHaveBeenCalledWith(
        'character-2',
        0
      );
    });

    it('should work when moving a character down', () => {
      testUtils.clickElementAt('.character-card__action--move-down', 1);
      expect(mockNovelStore.moveCharacter).toHaveBeenCalledWith(
        'character-2',
        3
      );
    });
  });
});
