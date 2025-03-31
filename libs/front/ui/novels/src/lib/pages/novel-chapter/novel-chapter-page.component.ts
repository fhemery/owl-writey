import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { NovelSceneViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelChapterSceneComponent } from './components/novel-chapter-scene/novel-chapter-scene.component';

@Component({
  selector: 'owl-novel-chapter-page',
  imports: [
    CommonModule,
    NovelCorkboardComponent,
    TranslateModule,
    NovelChapterSceneComponent,
  ],
  templateUrl: './novel-chapter-page.component.html',
  styleUrl: './novel-chapter-page.component.scss',
})
export class NovelChapterPageComponent {
  readonly chapterId = input.required<string>();
  readonly #store = inject(NovelStore);
  readonly novel = this.#store.novel;
  readonly chapter = computed(() =>
    this.novel()?.chapters.find((chapter) => chapter.id === this.chapterId())
  );

  async addScene($event: number): Promise<void> {
    await this.#store.addSceneAt(this.chapterId(), $event);
  }

  convertToScene(item: unknown): NovelSceneViewModel {
    return item as NovelSceneViewModel;
  }

  async updateScene($event: NovelSceneViewModel): Promise<void> {
    await this.#store.updateScene(this.chapterId(), $event);
  }
}
