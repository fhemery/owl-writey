import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, input } from '@angular/core';
import {
  ContenteditableDirective,
  TextEditorComponent,
} from '@owl/front/ui/common';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelScenePageViewModel } from './view-model/novel-scene-page-view-model';

@Component({
  selector: 'owl-novel-scene-page',
  imports: [CommonModule, TextEditorComponent, ContenteditableDirective],
  templateUrl: './novel-scene-page.component.html',
  styleUrl: './novel-scene-page.component.scss',
})
export class NovelScenePageComponent {
  readonly #novelStore = inject(NovelStore);
  readonly #novelContext = inject(NovelContextService);
  chapterId = input.required<string>();
  sceneId = input.required<string>();

  scene = computed(() =>
    NovelScenePageViewModel.From(
      this.chapterId(),
      this.sceneId(),
      this.#novelStore.novel()
    )
  );

  constructor() {
    effect(() => {
      this.#novelContext.setScene(this.chapterId(), this.sceneId());
    });
  }

  async updateContent(newText: string): Promise<void> {
    await this.#novelStore.updateSceneContent(
      this.chapterId(),
      this.sceneId(),
      newText
    );
  }

  async updateTitle(title: string): Promise<void> {
    const currentScene = this.scene();
    if (!currentScene || currentScene.title === title) {
      return;
    }

    await this.#novelStore.updateSceneTitle(
      this.chapterId(),
      this.sceneId(),
      title
    );
  }
}
