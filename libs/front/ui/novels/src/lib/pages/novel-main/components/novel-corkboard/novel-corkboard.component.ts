import { CommonModule } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'owl-novel-corkboard',
  imports: [CommonModule, MatIcon, TranslateModule],
  templateUrl: './novel-corkboard.component.html',
  styleUrl: './novel-corkboard.component.scss',
})
export class NovelCorkboardComponent {
  readonly addNewLabel = input<string>('');
  readonly items = input<unknown[]>([]);
  readonly itemTemplate = input<TemplateRef<unknown> | null>(null);
  readonly addNew = output<number>();

  onAddNew(index: number): void {
    this.addNew.emit(index);
  }
}
