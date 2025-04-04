import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelViewModel } from '../../../../model';
import { NovelContextService } from '../../../../services/novel-context.service';

@Component({
  selector: 'owl-novel-sidebar',
  imports: [CommonModule, TranslateModule, MatIcon, RouterLink],
  templateUrl: './novel-sidebar.component.html',
  styleUrl: './novel-sidebar.component.scss',
})
export class NovelSidebarComponent {
  readonly #novelContext = inject(NovelContextService);
  chapterId = this.#novelContext.chapterId;
  sceneId = this.#novelContext.sceneId;
  novel = input.required<NovelViewModel>();

  readonly manualOpenChapters = signal<string[]>([]);
  readonly openChaptersIds = computed(() => {
    return this.manualOpenChapters().concat([this.chapterId() ?? '']);
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
