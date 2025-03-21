import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
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
  height = computed<string>(() => `${this.nbLines() * 1.6}rem`);
  update = output<string>();

  updateContent($event: ContentChange): void {
    this.update.emit($event.html?.replace(/&nbsp;/g, ' ').trim() || '');
  }
}
