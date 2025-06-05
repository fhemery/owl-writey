import { CommonModule } from '@angular/common';
import { OutputRefSubscription } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { NgxEditorModule } from 'ngx-editor';

import { TextEditorComponent } from './text-editor.component';

const editorSelector = 'ngx-editor';
describe('TextEditorComponent', () => {
  let component: TextEditorComponent;
  let fixture: ComponentFixture<TextEditorComponent>;
  let testUtils: TestUtils;
  let lastEmittedText: string;
  let subscription: OutputRefSubscription;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TextEditorComponent,
        CommonModule,
        FormsModule,
        NgxEditorModule,
        BrowserAnimationsModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TextEditorComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);

    lastEmittedText = '';
    subscription = component.update.subscribe((value) => {
      lastEmittedText = value;
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    subscription.unsubscribe();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasElement(editorSelector)).toBeTruthy();
  });

  describe('Input parameters', () => {
    it('should update the text when currentContent changes', async () => {
      const newContent = 'New content';
      testUtils.setInput(() => component.currentContent, newContent, true);

      await testUtils.waitStable();

      expect(testUtils.getTextForElementAt(editorSelector)).toContain(
        newContent
      );
    });
  });

  describe('When typing', () => {
    it('should emit the text after a while', fakeAsync(async () => {
      testUtils.updateTextEditorContent('Something');

      tick(2000);
      await testUtils.waitStable();

      expect(lastEmittedText).toContain('Something');
    }));

    it('should emit the text when focus is lost', async () => {
      testUtils.updateTextEditorContent('Something');
      testUtils.dispatchEvent('focusOut', editorSelector);

      await testUtils.waitStable();

      expect(lastEmittedText).toContain('Something');
    });
  });
});
