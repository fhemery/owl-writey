import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countWordsFromHtml } from '@owl/shared/word-utils';
import { Editor, NgxEditorModule, Toolbar } from 'ngx-editor';
import { inputRules } from 'prosemirror-inputrules';
import { debounceTime, Subject, tap } from 'rxjs';

import { syntaxInputRules } from './syntax-input-rules';

@Component({
  selector: 'owl-text-editor',
  imports: [CommonModule, NgxEditorModule, FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements OnInit {
  currentContent = input<string>('');
  placeholder = input<string>('');
  width = input<string>('800px');
  nbLines = input<number | 'max'>(10);

  update = output<string>();
  isValid = output<boolean>();

  showWords = input<boolean>(false);
  minWords = input<number | null>(null);
  maxWords = input<number | null>(null);

  private updateTextWatcher$ = new Subject<string>();
  private isFocused = false;

  editor!: Editor;
  toolbar: Toolbar = [['bold', 'italic']];

  private initialText = this.currentContent();
  currentText = signal(this.currentContent());
  height = computed<string>(() => {
    const lines = this.nbLines();
    if (lines === 'max') {
      return '100%';
    }
    return `${lines * 1.6}rem`;
  });
  nbWords = computed(() => countWordsFromHtml(this.currentText()));

  isWordLimitCorrect = computed(() => {
    const minWords = this.minWords();
    const maxWords = this.maxWords();
    return (
      (minWords === null || this.nbWords() >= minWords) &&
      (maxWords === null || this.nbWords() <= maxWords)
    );
  });

  constructor() {
    effect(() => {
      if (this.currentContent() !== this.initialText) {
        this.initialText = this.currentContent();
        this.currentText.set(this.currentContent());
      }
    });

    this.editor = new Editor({
      plugins: [inputRules({ rules: syntaxInputRules })],
    });
  }

  ngOnInit(): void {
    this.updateTextWatcher$
      .pipe(
        tap((text: string) => this.currentText.set(text)),
        debounceTime(2000)
      )
      .subscribe(() => {
        if (this.isFocused) {
          this.sendTextUpdate();
        }
      });
  }

  focusIn(): void {
    this.isFocused = true;
  }

  focusOut(): void {
    this.isFocused = false;
    this.sendTextUpdate();
  }

  updateText($event: string): void {
    this.updateTextWatcher$.next($event);
  }

  private sendTextUpdate(): void {
    if (this.currentContent() !== this.currentText()) {
      this.update.emit(this.currentText());
      this.isValid.emit(this.isWordLimitCorrect());
    }
  }
}
