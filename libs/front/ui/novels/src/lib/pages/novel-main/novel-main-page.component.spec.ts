import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import {
  Resolution,
  RightPanelComponentDisplayRequest,
  RightPanelService,
  ScreenResolutionService,
} from '@owl/front/ui/common';
import { BaseRightPaneComponent } from '@owl/front/ui/common';
import { Novel, NovelBuilder } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelMainPageComponent } from './novel-main-page.component';

class RightPanelDummyComponent extends BaseRightPaneComponent<object> {}

describe('NovelMainPageComponent', () => {
  let component: NovelMainPageComponent;
  let fixture: ComponentFixture<NovelMainPageComponent>;
  let testUtils: TestUtils;
  let novel: WritableSignal<Novel | null>;

  beforeEach(async () => {
    novel = signal(null);
    await TestBed.configureTestingModule({
      imports: [NovelMainPageComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: NovelStore,
          useValue: {
            novel,
            loadNovel: vi.fn(),
            isLoading: signal(false),
          },
        },
        {
          provide: ScreenResolutionService,
          useValue: {
            resolution: signal(Resolution.Desktop),
            isBiggerThan: vi.fn().mockReturnValue(true),
            isSmallerOrEqualTo: vi.fn().mockReturnValue(false),
          },
        },
        provideRouter([{ path: '**', component: NovelMainPageComponent }]),
      ],
    }).compileComponents();

    localStorage.clear();
    fixture = TestBed.createComponent(NovelMainPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    testUtils.setInput(() => component.id, '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not display anything until novel is loaded', () => {
    expect(testUtils.hasElement('owl-novel-sidebar')).toBe(false);
  });

  describe('when novel is loaded', () => {
    beforeEach(() => {
      novel.set(
        NovelBuilder.New(
          'title',
          'description',
          'authorId',
          'authorName'
        ).build()
      );
      fixture.detectChanges();
    });

    it('should display the novel', () => {
      expect(testUtils.hasElement('owl-novel-sidebar')).toBe(true);
    });

    describe('Left panel', () => {
      it('should be opened by default', () => {
        expect(
          testUtils.hasElement(
            '.layout__left-panel .side-panel--left.side-panel--open'
          )
        ).toBe(true);
      });

      it('should not display the left sidebar if it has been closed', () => {
        testUtils.clickElementAt('.layout__left-panel .side-panel__toggle', 0);
        expect(
          testUtils.hasElement(
            '.layout__left-panel .side-panel--left.side-panel--closed'
          )
        ).toBe(true);
      });

      it('should retain the status of the sidebar in local storage', () => {
        testUtils.clickElementAt('.layout__left-panel .side-panel__toggle', 0);

        fixture = TestBed.createComponent(NovelMainPageComponent);
        component = fixture.componentInstance;
        testUtils = new TestUtils(fixture);
        testUtils.setInput(() => component.id, '1');
        fixture.detectChanges();

        expect(
          testUtils.hasElement(
            '.layout__left-panel .side-panel--left.side-panel--closed'
          )
        ).toBe(true);
      });
    });

    describe('Right panel', () => {
      it('should be closed by default', () => {
        expect(testUtils.hasElement('.layout__right-panel')).toBe(false);
      });

      it('should be opened if any component is added to the right panel', () => {
        const rightPanelService = TestBed.inject(RightPanelService);
        rightPanelService.displayComponent(
          new RightPanelComponentDisplayRequest(RightPanelDummyComponent, {})
        );
        fixture.detectChanges();

        expect(
          testUtils.hasElement('.layout__right-panel .side-panel--open')
        ).toBe(true);
      });

      it('should close the panel if requested by user', () => {
        const rightPanelService = TestBed.inject(RightPanelService);
        rightPanelService.displayComponent(
          new RightPanelComponentDisplayRequest(RightPanelDummyComponent, {})
        );
        fixture.detectChanges();

        testUtils.clickElementAt('.layout__right-panel .side-panel__toggle', 0);

        expect(
          testUtils.hasElement('.layout__right-panel .side-panel--closed')
        ).toBe(true);
      });

      it('should remember the state of the panel in local storage', () => {
        const rightPanelService = TestBed.inject(RightPanelService);
        rightPanelService.displayComponent(
          new RightPanelComponentDisplayRequest(RightPanelDummyComponent, {})
        );
        fixture.detectChanges();

        testUtils.clickElementAt('.layout__right-panel .side-panel__toggle', 0);

        fixture = TestBed.createComponent(NovelMainPageComponent);
        component = fixture.componentInstance;
        testUtils = new TestUtils(fixture);
        testUtils.setInput(() => component.id, '1');
        fixture.detectChanges();

        expect(
          testUtils.hasElement('.layout__right-panel .side-panel--closed')
        ).toBe(true);
      });
    });
  });
});
