import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ExerciseService } from '../../services/exercise.service';
import { ExerciseNewPageComponent } from './exercise-new-page.component';

describe('ExerciseNewPageComponent', () => {
  let component: ExerciseNewPageComponent;
  let fixture: ComponentFixture<ExerciseNewPageComponent>;
  let exerciseService: Partial<ExerciseService>;
  let router: Partial<Router>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    exerciseService = { create: vi.fn() };
    router = { navigateByUrl: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [ExerciseNewPageComponent, TranslateModule.forRoot()],
      providers: [
        { provide: ExerciseService, useValue: exerciseService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExerciseNewPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    await testUtils.waitStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasElement('.exercise-new-page')).toBeTruthy();
  });

  describe('general fields', () => {
    it('should have a title', () => {
      expect(testUtils.hasElement('h1')).toBeTruthy();
      expect(testUtils.hasText('exercise.new.title', 'h1')).toBeTruthy();
    });

    it('should have a name field in the form', () => {
      expect(testUtils.hasElement('input[name="name"]')).toBeTruthy();
    });

    it('should have a type field in the form defaulting to ExquisiteCorpse', () => {
      expect(testUtils.hasElement('input[name="type"]')).toBeTruthy();
      expect(testUtils.getValue('input[name="type"]')).toBe('ExquisiteCorpse');
    });

    it('should display by default the exquisite corpse form', () => {
      expect(testUtils.hasElement('owl-exquisite-form-corpse')).toBeTruthy();
    });

    describe('errors', () => {
      it('should show an error if the name is empty', () => {
        testUtils.updateInputField('input[name="name"]', '');
        expect(
          testUtils.hasText('exercise.form.name.error.required', 'mat-error')
        ).toBeTruthy();
      });

      it('should show an error if the name is too short', () => {
        testUtils.updateInputField('input[name="name"]', 'ab');
        expect(
          testUtils.hasText('exercise.form.name.error.minlength', 'mat-error')
        ).toBeTruthy();
      });
    });
  });

  describe('Exquisite corpse fields', () => {
    describe('errors', () => {
      it('should show an error if the nbIterations is negative', () => {
        testUtils.updateInputField('input[name="nbIterations"]', '-1');
        expect(
          testUtils.hasText(
            'exercise.form.exquisiteCorpse.nbIterations.error.min',
            'mat-error'
          )
        ).toBeTruthy();
      });
      it('should not show an error if the nbIterations is 0', () => {
        testUtils.updateInputField('input[name="nbIterations"]', '0');
        expect(testUtils.hasElement('mat-error')).toBe(true);
      });

      it('should show an error if the initial text is empty', () => {
        testUtils.updateInputField('textarea[name="initialText"]', '');
        expect(
          testUtils.hasText(
            'exercise.form.exquisiteCorpse.initialText.error.required',
            'mat-error'
          )
        ).toBeTruthy();
      });

      it('should display an error if max words is less than min words', () => {
        testUtils.updateInputField('input[name="minWords"]', '2');
        testUtils.updateInputField('input[name="maxWords"]', '1');
        expect(
          testUtils.hasElement('.exquisite-corpse-form__words-error')
        ).toBeTruthy();
      });

      it('should display an error if min words is negative', () => {
        testUtils.updateInputField('input[name="minWords"]', '-1');
        expect(testUtils.hasElement('mat-error')).toBeTruthy();
      });

      it('should display an error if min words is 0', () => {
        testUtils.updateInputField('input[name="minWords"]', '0');
        expect(testUtils.hasElement('mat-error')).toBeTruthy();
      });

      it('should display an error if max words is negative', () => {
        testUtils.updateInputField('input[name="maxWords"]', '-1');
        expect(testUtils.hasElement('mat-error')).toBeTruthy();
      });

      it('should display an error if max words is 0', () => {
        testUtils.updateInputField('input[name="maxWords"]', '0');
        expect(testUtils.hasElement('mat-error')).toBeTruthy();
      });
    });

    describe('valid values', () => {
      it('should not show an error if the nbIterations is empty', () => {
        testUtils.updateInputField('input[name="nbIterations"]', '');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should not show an error if the nbIterations is a positive number', () => {
        testUtils.updateInputField('input[name="nbIterations"]', '1');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should by default display 900seconds (15 minutes) as the turn duration', () => {
        expect(
          testUtils.hasSelectedValue(
            'iterationDuration',
            'exercise.form.exquisiteCorpse.iterationDuration.options.fifteenMinutes'
          )
        ).toBeTruthy();
      });

      it('should display no error if both min and max words are empty', () => {
        testUtils.updateInputField('input[name="minWords"]', '');
        testUtils.updateInputField('input[name="maxWords"]', '');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should display no error if both min and max words are set to the same value', () => {
        testUtils.updateInputField('input[name="minWords"]', '1');
        testUtils.updateInputField('input[name="maxWords"]', '1');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should display no error if min words is less than max words', () => {
        testUtils.updateInputField('input[name="minWords"]', '1');
        testUtils.updateInputField('input[name="maxWords"]', '2');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should display no error if initialText is filled', () => {
        testUtils.updateInputField('textarea[name="initialText"]', 'test');
        expect(testUtils.hasElement('mat-error')).toBeFalsy();
      });

      it('should enable submit button if at least the default values are filled correctly', () => {
        testUtils.updateInputField('input[name="name"]', 'test');
        testUtils.updateInputField('textarea[name="initialText"]', 'test');

        expect(testUtils.isDisabled('button[type="submit"]')).toBeFalsy();
      });
    });
  });
});
