import { CommonModule } from '@angular/common';
import { Component, input, output, signal, TemplateRef } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DndDropEvent, DndDropzoneDirective, DndModule } from 'ngx-drag-drop';

@Component({
  selector: 'owl-novel-corkboard',
  imports: [
    CommonModule,
    MatIcon,
    TranslateModule,
    DndModule,
    DndDropzoneDirective,
    MatTooltipModule,
  ],
  templateUrl: './novel-corkboard.component.html',
  styleUrl: './novel-corkboard.component.scss',
})
export class NovelCorkboardComponent {
  readonly addNewLabel = input<string>('');
  readonly maxItems = input<2 | 4>(4);
  readonly items = input<unknown[]>([]);
  readonly itemTemplate = input<TemplateRef<unknown> | null>(null);
  readonly disablePositionalAdd = input<boolean>(false);
  readonly addNew = output<number>();
  readonly moveItem = output<{ from: number; to: number }>();

  isDragOngoing = signal(false);

  onAddNew(index: number): void {
    this.addNew.emit(index);
  }

  dropAt($event: DndDropEvent, toIndex: number): void {
    const itemIndex = $event.data as number;
    if (itemIndex === toIndex || itemIndex === toIndex - 1) {
      return;
    }
    this.moveItem.emit({ from: itemIndex, to: toIndex });
  }

  dragStart(): void {
    this.isDragOngoing.set(true);
  }

  dragEnd(): void {
    this.isDragOngoing.set(false);
  }
}
