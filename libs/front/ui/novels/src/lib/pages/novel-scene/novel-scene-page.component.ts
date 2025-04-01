import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { TextEditorComponent } from '@owl/front/ui/common';

import { NovelSceneViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';

@Component({
  selector: 'owl-novel-scene-page',
  imports: [CommonModule, TextEditorComponent],
  templateUrl: './novel-scene-page.component.html',
  styleUrl: './novel-scene-page.component.scss',
})
export class NovelScenePageComponent {
  readonly #novelStore = inject(NovelStore);
  chapterId = input.required<string>();
  sceneId = input.required<string>();

  scene = computed(() => {
    return this.#novelStore
      .getNovel()
      .chapters.find((c) => c.id === this.chapterId())
      ?.scenes.find((s) => s.id === this.sceneId());
  });

  async updateContent(newText: string): Promise<void> {
    const currentScene = this.scene();
    if (!currentScene) {
      return;
    }
    const scene = new NovelSceneViewModel(
      currentScene.id,
      currentScene.generalInfo,
      newText
    );
    await this.#novelStore.updateScene(this.chapterId(), scene);
  }
}
