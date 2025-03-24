import { CommonModule } from '@angular/common';
import { Component, computed, input, output, signal } from '@angular/core';
import { countWordsFromHtml } from '@owl/shared/word-utils';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'owl-text-editor',
  imports: [CommonModule, QuillEditorComponent],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent {
  placeholder = input<string>('');
  width = input<string>('800px');
  nbLines = input<number>(10);

  update = output<string>();
  isValid = output<boolean>();

  showWords = input<boolean>(false);
  minWords = input<number | null>(null);
  maxWords = input<number | null>(null);

  currentText = signal('');
  height = computed<string>(() => `${this.nbLines() * 1.6}rem`);
  nbWords = computed(() => countWordsFromHtml(this.currentText()));

  isWordLimitIncorrect = computed(() => {
    const nbWords = this.nbWords();
    const minWords = this.minWords();
    const maxWords = this.maxWords();
    return (
      (minWords !== null && nbWords < minWords) ||
      (maxWords !== null && nbWords > maxWords)
    );
  });

  updateContent($event: ContentChange): void {
    const text = $event.html?.replace(/&nbsp;/g, ' ').trim() || '';
    this.currentText.set(text);
    this.update.emit(text);
    this.isValid.emit(!this.isWordLimitIncorrect());
  }
}
