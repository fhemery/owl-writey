import { Component, ElementRef, input, output, ViewChild } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ContentEditableDirective } from '@owl/front/ui/common';
import { StatsChipComponent } from '@owl/front/ui/common';
import {
  NovelChapter,
  NovelChapterGeneralInfo,
} from '@owl/shared/novels/model';

@Component({
  selector: 'owl-novel-overview-chapter-card',
  imports: [
    ContentEditableDirective,
    MatIcon,
    MatTooltip,
    TranslateModule,
    StatsChipComponent,
  ],
  templateUrl: './novel-overview-chapter-card.component.html',
  styleUrl: './novel-overview-chapter-card.component.scss',
})
export class NovelOverviewChapterCardComponent {
  chapter = input.required<NovelChapter>();
  updateChapter = output<NovelChapter>();
  deleteChapter = output<void>();
  moveChapter = output<number>();
  goTo = output<void>();

  @ViewChild('titleElement') titleElement?: ElementRef;

  async updateTitle(title: string): Promise<void> {
    const newChapter = new NovelChapter(
      this.chapter().id,
      new NovelChapterGeneralInfo(title, this.chapter().generalInfo.outline),
      this.chapter().scenes
    );
    if (title !== this.chapter().generalInfo.title) {
      this.updateChapter.emit(newChapter);
    }
  }

  async updateOutline(outline: string): Promise<void> {
    const newChapter = new NovelChapter(
      this.chapter().id,
      new NovelChapterGeneralInfo(this.chapter().generalInfo.title, outline),
      this.chapter().scenes
    );
    if (outline !== this.chapter().generalInfo.outline) {
      this.updateChapter.emit(newChapter);
    }
  }

  onDeleteChapter(): void {
    this.deleteChapter.emit();
  }

  onMoveChapter(delta: number): void {
    this.moveChapter.emit(delta);
  }

  async goToChapter(): Promise<void> {
    this.goTo.emit();
  }

  focus(): void {
    this.titleElement?.nativeElement?.click();
  }
}
