import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countWordsFromHtml } from '@owl/shared/word-utils';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'owl-text-editor',
  imports: [CommonModule, QuillEditorComponent, FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent {
  currentContent = input<string>('');
  placeholder = input<string>('');
  width = input<string>('800px');
  nbLines = input<number | 'max'>(10);

  update = output<string>();
  isValid = output<boolean>();

  showWords = input<boolean>(false);
  minWords = input<number | null>(null);
  maxWords = input<number | null>(null);

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
  }

  updateContent($event: ContentChange): void {
    this.currentText.set($event.html || '');
    this.update.emit(this.currentText());
    this.isValid.emit(this.isWordLimitCorrect());
  }
}
