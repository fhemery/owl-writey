import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { countWordsFromHtml } from '@owl/shared/word-utils';
import {
  Editor,
  NgxEditorModule,
  NgxEditorService,
  schema,
  Toolbar,
} from 'ngx-editor';
import { inputRules } from 'prosemirror-inputrules';
import { debounceTime, Subject, tap } from 'rxjs';

import { FullscreenMenuComponent } from './fullscreen-menu/fullscreen-menu.component';
import { generateEditorLocaleButtons } from './locals/editor-locale-buttons';
import { syntaxInputRules } from './syntax-input-rules';

@Component({
  selector: 'owl-text-editor',
  imports: [
    CommonModule,
    NgxEditorModule,
    FormsModule,
    FullscreenMenuComponent,
  ],
  providers: [
    {
      provide: NgxEditorService,
      useFactory: (): NgxEditorService => {
        const translate = inject(TranslateService);
        return new NgxEditorService({
          locals: generateEditorLocaleButtons(translate),
          icons: {},
        });
      },
    },
  ],
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
  toolbar: Toolbar = [
    ['bold', 'italic', 'strike', 'underline'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['blockquote', 'horizontal_rule'],
    ['text_color'],
  ];

  @ViewChild('customMenu') customMenu!: TemplateRef<unknown>;

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

    const currentSchema = schema;
    delete (currentSchema as { nodes: { image: unknown } }).nodes.image;
    delete (currentSchema as { nodes: { heading: unknown } }).nodes.heading;
    this.editor = new Editor({
      plugins: [inputRules({ rules: syntaxInputRules })],
      schema: currentSchema,
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
