import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import {
  ExerciseDto,
  ExerciseStatus,
  ExerciseType,
  ExquisiteCorpseExerciseDto,
  ExquisiteCorpseLinksDto,
} from '@owl/shared/exercises/contracts';

import { ExerciseService } from '../../services/exercise.service';
import { ExerciseStore } from '../../services/exercise.store';
import { ExquisiteCorpseService } from '../../services/exquisite-corpse.service';
import { ExquisiteCorpseStore } from '../../services/exquisite-corpse.store';
import { ExercisePageComponent } from './exercise-page.component';

describe('ExercisePageComponent', () => {
  let component: ExercisePageComponent;
  let fixture: ComponentFixture<ExercisePageComponent>;
  let testUtils: TestUtils;
  let exerciseStore: Partial<ExerciseStore>;
  let exercise: WritableSignal<ExerciseDto | null>;

  beforeEach(() => {
    exercise = signal(null);
    exerciseStore = {
      exercise: exercise,
      setExercise: vi.fn().mockReturnValue(Promise.resolve()),
      isAdmin: signal(true),
    };
    TestBed.configureTestingModule({
      imports: [ExercisePageComponent, TranslateModule.forRoot()],
      providers: [
        {
          provide: ExerciseService,
          useValue: { getOne: vi.fn().mockResolvedValue({} as ExerciseDto) },
        },
        provideRouter([{ path: '**', component: ExercisePageComponent }]),
      ],
    })
      .overrideProvider(ExerciseStore, {
        useValue: exerciseStore,
      })
      .overrideProvider(ExquisiteCorpseService, {
        useValue: {},
      })
      .overrideProvider(ExquisiteCorpseStore, {
        useValue: {
          exercise,
          setExercise: vi.fn().mockReturnValue(Promise.resolve()),
        },
      });
    fixture = TestBed.createComponent(ExercisePageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    testUtils.setInput(() => component.id, '1');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasElement('.exercise-page')).toBeTruthy();
  });

  describe('when exercise is ongoing', () => {
    beforeEach(() => {
      exercise.set(getExercise(ExerciseStatus.Ongoing));
      fixture.detectChanges();
    });

    it('should display invitation link if there is only one participant', () => {
      exercise.set({
        ...getExercise(ExerciseStatus.Ongoing),
        participants: [{ name: 'John Doe', uid: '1', isAdmin: true }],
      });
      fixture.detectChanges();
      expect(testUtils.hasElement('.exCo-details__share')).toBeTruthy();
    });

    it('should not display invitation link if there is more than one participant', () => {
      exercise.set({
        ...getExercise(ExerciseStatus.Ongoing),
        participants: [
          { name: 'John Doe', uid: '1', isAdmin: true },
          { name: 'Jane Doe', uid: '2', isAdmin: false },
        ],
      });
      fixture.detectChanges();
      expect(testUtils.hasElement('.exCo-details__share')).toBeFalsy();
    });
  });

  describe('when exercise is finished', () => {
    beforeEach(() => {
      exercise.set(getExercise(ExerciseStatus.Finished));
      fixture.detectChanges();
    });

    it('should not display invitation link', () => {
      exercise.set({
        ...getExercise(ExerciseStatus.Finished),
        participants: [{ name: 'John Doe', uid: '1', isAdmin: true }],
      });
      fixture.detectChanges();
      expect(testUtils.hasElement('.exCo-details__share')).toBeFalsy();
    });
  });
});

function getExercise(status: ExerciseStatus): ExquisiteCorpseExerciseDto {
  return {
    type: ExerciseType.ExquisiteCorpse,
    status,
    participants: [],
    content: {
      scenes: [],
    },
    _links: {} as ExquisiteCorpseLinksDto,
    config: {},
    id: '',
    name: '',
  };
}
