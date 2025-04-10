import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TestUtils } from '@owl/front/test-utils';

import { ConfirmDialogComponent } from './confirm-dialog.component';

describe('ConfirmDialogComponent', () => {
  let component: ConfirmDialogComponent;
  let fixture: ComponentFixture<ConfirmDialogComponent>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmDialogComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    testUtils.setInput(() => component.title, 'Test title');
    testUtils.setInput(() => component.confirmLabel, 'Confirm');
    testUtils.setInput(() => component.cancelLabel, 'Cancel');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Display', () => {
    it('should display title', () => {
      const newTitle = 'Test title111';
      testUtils.setInput(() => component.title, newTitle, true);

      const title = testUtils.getTextForElementAt('.confirm-dialog__header');
      expect(title).toEqual(newTitle);
    });

    it('should display both cancel and confirm button labels', () => {
      const confirmLabel = 'DoConfirm';
      const cancelLabel = 'DoCancel';
      testUtils.setInput(() => component.confirmLabel, confirmLabel, true);
      testUtils.setInput(() => component.cancelLabel, cancelLabel, true);

      const actualConfirmLabel = testUtils.getTextForElementAt(
        '.confirm-dialog__confirm-btn'
      );
      expect(actualConfirmLabel).toEqual(confirmLabel);

      const actualCancelLabel = testUtils.getTextForElementAt(
        '.confirm-dialog__cancel-btn'
      );
      expect(actualCancelLabel).toEqual(cancelLabel);
    });

    it('should have a content area to project content', () => {
      expect(testUtils.hasElement('.confirm-dialog__content')).toBe(true);
    });

    it('should by default enable the confirm button', () => {
      expect(
        testUtils
          .getElementAt(' .confirm-dialog__confirm-btn')
          .getAttribute('disabled')
      ).toBeNull();
    });

    it('should by disable button if input says so', () => {
      testUtils.setInput(() => component.confirmEnabled, false, true);

      expect(
        testUtils
          .getElementAt(' .confirm-dialog__confirm-btn')
          .getAttribute('disabled')
      ).toBe('true');
    });
  });

  describe('Actions', () => {
    it('should send true if user clicks confirm button', () => {
      const spy = vi.spyOn(component.confirm, 'emit');

      testUtils.clickElementAt('.confirm-dialog__confirm-btn');

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should send false if user clicks cancel button', () => {
      const spy = vi.spyOn(component.confirm, 'emit');

      testUtils.clickElementAt('.confirm-dialog__cancel-btn');

      expect(spy).toHaveBeenCalledWith(false);
    });

    it('should send false if user closes window', () => {
      const spy = vi.spyOn(component.confirm, 'emit');

      testUtils.clickElementAt('.dialog__close');

      expect(spy).toHaveBeenCalledWith(false);
    });
  });
});
