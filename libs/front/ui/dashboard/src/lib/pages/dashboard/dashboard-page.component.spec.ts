import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE, User } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';
import { LocalConfigService } from '@owl/front/ui/common';
import {
  ExerciseStatus,
  ExerciseSummaryDto,
  ExerciseType,
} from '@owl/shared/exercises/contracts';
import { NovelSummaryDto } from '@owl/shared/novels/contracts';

import { DashboardService } from '../../services/dashboard.service';
import { DashboardPageComponent } from './dashboard-page.component';

describe('DashboardPageComponent', () => {
  let component: DashboardPageComponent;
  let fixture: ComponentFixture<DashboardPageComponent>;
  let testUtils: TestUtils;
  let dashboardService: Partial<DashboardService>;
  let localConfigService: Partial<LocalConfigService>;
  const user = signal<User | null>(new User('1', 'test', []));
  let configSignal: WritableSignal<{ displayFinished?: boolean }>;

  const mockExercises: ExerciseSummaryDto[] = [
    {
      id: '1',
      name: 'Ongoing def',
      type: ExerciseType.ExquisiteCorpse,
      status: ExerciseStatus.Ongoing,
      _links: { self: 'self' },
    },
    {
      id: '2',
      name: 'Finished abc',
      type: ExerciseType.ExquisiteCorpse,
      status: ExerciseStatus.Finished,
      _links: { self: 'self' },
    },
    {
      id: '3',
      name: 'Ongoing abc',
      type: ExerciseType.ExquisiteCorpse,
      status: ExerciseStatus.Ongoing,
      _links: { self: 'self' },
    },
    {
      id: '4',
      name: 'Finished def',
      type: ExerciseType.ExquisiteCorpse,
      status: ExerciseStatus.Finished,
      _links: { self: 'self' },
    },
  ];

  const mockNovels: NovelSummaryDto[] = [
    { id: '1', title: 'Novel 1' } as NovelSummaryDto,
    { id: '2', title: 'Novel 2' } as NovelSummaryDto,
  ];

  beforeEach(async (): Promise<void> => {
    dashboardService = {
      getExercises: vi.fn().mockImplementation(({ displayFinished }) => {
        return Promise.resolve(
          mockExercises.filter((e) =>
            displayFinished ? true : e.status !== ExerciseStatus.Finished
          )
        );
      }),
      getNovels: vi.fn().mockResolvedValue(mockNovels),
    };
    configSignal = signal({});
    localConfigService = {
      getUpdates: vi.fn().mockReturnValue(configSignal),
      update: vi.fn().mockImplementation((key: string, config: unknown) => {
        configSignal.set(config as { displayFinished?: boolean });
      }),
    };
    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DashboardService, useValue: dashboardService },
        { provide: AUTH_SERVICE, useValue: { user: user } },
        { provide: LocalConfigService, useValue: localConfigService },
        provideRouter([{ path: '**', component: DashboardPageComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasElement('.dashboard-page')).toBe(true);
  });

  describe('Exercises', () => {
    it('should load only non-finished exercises on init', async () => {
      await testUtils.waitStable();
      expect(testUtils.getNbElements('owl-dashboard-exercise-card')).toEqual(2);
    });

    it('should display exercises section', () => {
      expect(
        testUtils.hasElement('.dashboard-page__panel owl-dashboard-exercises')
      ).toBe(true);
    });

    it('should display toggle for finished exercises', () => {
      expect(testUtils.hasElement('mat-slide-toggle')).toBe(true);
    });

    it('should display add button for exercises', () => {
      const exerciseButtons = fixture.nativeElement.querySelectorAll(
        '#dashboardExercisesHeader button[mat-fab]'
      );
      expect(exerciseButtons.length).toBe(1);
    });

    describe('Toggling finished', () => {
      it('should toggle displayFinished and reload exercises when toggle is clicked', async () => {
        testUtils.clickToggle('#dashboardExercisesHeader mat-slide-toggle');
        await testUtils.waitStable();

        expect(testUtils.getNbElements('owl-dashboard-exercise-card')).toBe(4);
      });

      it('should persist from one session to another', async () => {
        testUtils.clickToggle('#dashboardExercisesHeader mat-slide-toggle');
        await testUtils.waitStable();

        fixture = TestBed.createComponent(DashboardPageComponent);
        component = fixture.componentInstance;
        testUtils = new TestUtils(fixture);
        fixture.detectChanges();
        await testUtils.waitStable();

        expect(testUtils.getNbElements('owl-dashboard-exercise-card')).toBe(4);
        expect(
          testUtils.hasActiveToggle(
            '#dashboardExercisesHeader mat-slide-toggle'
          )
        ).toBe(true);
      });
    });

    describe('sorting', () => {
      it('should sort exercises by completion, then by name', async () => {
        testUtils.clickToggle('#dashboardExercisesHeader mat-slide-toggle');
        await testUtils.waitStable();
        const selector = 'owl-dashboard-exercise-card mat-card-title';

        expect(testUtils.getTextForElementAt(selector, 0)).toBe('Ongoing abc');
        expect(testUtils.getTextForElementAt(selector, 1)).toBe('Ongoing def');
        expect(testUtils.getTextForElementAt(selector, 2)).toBe('Finished abc');
        expect(testUtils.getTextForElementAt(selector, 3)).toBe('Finished def');
      });
    });
  });

  describe('Novels', () => {
    it('should load novels on init', async () => {
      expect(dashboardService.getNovels).toHaveBeenCalled();
    });

    it('should display novels section', () => {
      expect(testUtils.hasElement('owl-dashboard-novels')).toBe(true);
    });

    it('should display add button for novels', () => {
      expect(testUtils.hasElement('#dashboardNovelsAddButton')).toBe(true);
    });
  });
});
