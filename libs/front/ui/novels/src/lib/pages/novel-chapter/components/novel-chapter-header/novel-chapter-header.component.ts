
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import {
  ContentEditableDirective,
  StatsChipComponent,
} from '@owl/front/ui/common';

import { ChapterPageViewModel } from '../../model/chapter-page.view-model';

@Component({
  selector: 'owl-novel-chapter-header',
  standalone: true,
  imports: [
    MatIconModule,
    TranslateModule,
    ContentEditableDirective,
    StatsChipComponent
],
  templateUrl: './novel-chapter-header.component.html',
  styleUrl: './novel-chapter-header.component.scss',
})
export class NovelChapterHeaderComponent {
  @Input() chapter!: ChapterPageViewModel;
  @Output() chapterNavigate = new EventEmitter<string>();
  @Output() titleChange = new EventEmitter<string>();
  @Output() goToNovel = new EventEmitter<void>();

  onTitleChange(title: string): void {
    this.titleChange.emit(title);
  }

  onChapterNavigate(chapterId: string): void {
    this.chapterNavigate.emit(chapterId);
  }

  onGoToNovel(): void {
    this.goToNovel.emit();
  }
}
