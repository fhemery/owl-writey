import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { countWordsFromHtml } from '@owl/shared/word-utils';
import { ContentChange, QuillEditorComponent } from 'ngx-quill';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'owl-text-editor',
  imports: [CommonModule, QuillEditorComponent, FormsModule],
  templateUrl: './text-editor.component.html',
  styleUrl: './text-editor.component.scss',
})
export class TextEditorComponent implements OnInit {
  currentContent = input<string>('');
  placeholder = input<string>('');
  width = input<string>('800px');
  debounceTime = input<number>(1000);
  nbLines = input<number>(10);

  update = output<string>();
  isValid = output<boolean>();

  showWords = input<boolean>(false);
  minWords = input<number | null>(null);
  maxWords = input<number | null>(null);

  textInput = this.currentContent();
  currentText = signal(this.currentContent());
  height = computed<string>(() => `${this.nbLines() * 1.6}rem`);
  nbWords = computed(() => countWordsFromHtml(this.currentText()));

  readonly #debouncedText$ = new Subject<string>();

  isWordLimitIncorrect = computed(() => {
    const nbWords = this.nbWords();
    const minWords = this.minWords();
    const maxWords = this.maxWords();
    return (
      (minWords !== null && nbWords < minWords) ||
      (maxWords !== null && nbWords > maxWords)
    );
  });

  ngOnInit(): void {
    this.textInput = this.currentContent();

    this.#debouncedText$
      .pipe(debounceTime(this.debounceTime()))
      .subscribe((text) => {
        this.update.emit(text);
        this.isValid.emit(!this.isWordLimitIncorrect());
      });
  }

  updateContent($event: ContentChange): void {
    const text = $event.html?.replace(/&nbsp;/g, ' ').trim() || '';
    this.currentText.set(text);
    this.#debouncedText$.next(text);
  }
}
