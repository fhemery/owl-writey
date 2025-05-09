import { CommonModule } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Novel } from '@owl/shared/novels/model';

import { NovelContextService } from '../../../../services/novel-context.service';
import { NovelSidebarChapterListComponent } from './components/novel-sidebar-chapter-list/novel-sidebar-chapter-list.component';
import { NovelSidebarUniverseComponent } from './components/novel-sidebar-universe/novel-sidebar-universe.component';

@Component({
  selector: 'owl-novel-sidebar',
  imports: [
    CommonModule,
    TranslateModule,
    NovelSidebarChapterListComponent,
    NovelSidebarUniverseComponent,
  ],
  templateUrl: './novel-sidebar.component.html',
  styleUrl: './novel-sidebar.component.scss',
})
export class NovelSidebarComponent {
  readonly #novelContext = inject(NovelContextService);
  readonly chapterId = this.#novelContext.chapterId;
  readonly sceneId = this.#novelContext.sceneId;
  novel = input.required<Novel>();
}
