import { CommonModule } from '@angular/common';
import { OutputRefSubscription } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TestUtils } from '@owl/front/test-utils';
import { Editor, NgxEditorModule } from 'ngx-editor';

import { TextEditorComponent } from './text-editor.component';

class EditorUtils {
  constructor(
    private readonly fixture: ComponentFixture<TextEditorComponent>
  ) {}

  typeText(text: string, clearCurrentContent = false): void {
    const editorComponent = this.fixture.debugElement.query(
      By.css('ngx-editor')
    ).componentInstance['editor'] as Editor;
    if (clearCurrentContent) {
      editorComponent.setContent('');
    }
    editorComponent.commands.focus('end').exec();
    let isFirstOperation = true;
    text.split(`\n`).forEach((text) => {
      if (isFirstOperation) {
        isFirstOperation = false;
      } else {
        editorComponent.commands.insertNewLine().exec();
      }
      editorComponent.commands.insertText(text).exec();
    });

    this.fixture.detectChanges();
  }
}

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
      const editorUtils = new EditorUtils(fixture);
      editorUtils.typeText('Something');

      tick(2000);
      await testUtils.waitStable();

      expect(lastEmittedText).toContain('Something');
    }));

    it('should emit the text when focus is lost', async () => {
      const editorUtils = new EditorUtils(fixture);
      editorUtils.typeText('Something');
      testUtils.dispatchEvent('focusOut', editorSelector);

      await testUtils.waitStable();

      expect(lastEmittedText).toContain('Something');
    });
  });
});
