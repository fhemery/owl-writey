import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE, User } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';
import { Role } from '@owl/shared/common/contracts';
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
  const user = signal<User | null>(new User('1', 'test', []));

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

    await TestBed.configureTestingModule({
      imports: [DashboardPageComponent, TranslateModule.forRoot()],
      providers: [
        { provide: DashboardService, useValue: dashboardService },
        { provide: AUTH_SERVICE, useValue: { user: user } },
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
      const exerciseButtons =
        fixture.nativeElement.querySelectorAll('button[mat-fab]');
      expect(exerciseButtons.length).toBe(1);
    });

    describe('Toggling finished', () => {
      it('should toggle displayFinished and reload exercises when toggle is clicked', async () => {
        testUtils.clickToggle('#dashboardExercisesHeader mat-slide-toggle');
        await testUtils.waitStable();

        expect(testUtils.getNbElements('owl-dashboard-exercise-card')).toBe(4);
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

    describe('when user is a beta user', () => {
      beforeEach(async () => {
        user.set(new User('1', 'test', [Role.Beta]));
        await testUtils.waitStable();
      });

      it('should display novels section when user is beta user', () => {
        expect(testUtils.hasElement('owl-dashboard-novels')).toBe(true);
      });

      it('should display add button for novels when user is beta user', () => {
        expect(testUtils.hasElement('#dashboardNovelsAddButton')).toBe(true);
      });
    });

    describe('when user is not a beta user', () => {
      beforeEach(async () => {
        user.set(new User('1', 'test', []));
        await testUtils.waitStable();
      });

      it('should not display novels section when user is not beta user', () => {
        expect(testUtils.hasElement('owl-dashboard-novels')).toBe(false);
      });
    });
  });
});
