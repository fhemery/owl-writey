import { CommonModule } from '@angular/common';
import { Component, computed, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Novel } from '@owl/shared/novels/model';

@Component({
  selector: 'owl-novel-sidebar-chapter-list',
  imports: [CommonModule, RouterLink, MatIcon, TranslateModule],
  templateUrl: './novel-sidebar-chapter-list.component.html',
  styleUrl: './novel-sidebar-chapter-list.component.scss',
})
export class NovelSidebarChapterListComponent {
  novel = input.required<Novel>();
  selectedChapterId = input.required<string | undefined>();
  selectedSceneId = input.required<string | undefined>();

  readonly manualOpenChapters = signal<string[]>([]);
  readonly openChaptersIds = computed(() => {
    return this.manualOpenChapters().concat([this.selectedChapterId() ?? '']);
  });

  toggleChapterOpen(chapterId: string): void {
    this.manualOpenChapters.update((ids) => {
      if (ids.includes(chapterId)) {
        return ids.filter((id) => id !== chapterId);
      } else {
        return ids.concat([chapterId]);
      }
    });
  }
}
