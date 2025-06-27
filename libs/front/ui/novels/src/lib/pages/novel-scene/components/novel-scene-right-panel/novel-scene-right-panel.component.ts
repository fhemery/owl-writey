
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  BaseRightPaneComponent,
  ContentEditableDirective,
} from '@owl/front/ui/common';

import { NovelPovComponent } from '../../../../components/novel-pov/novel-pov.component';
import { NovelStore } from '../../../../services/novel.store';
import { NovelScenePageViewModel } from '../../view-model/novel-scene-page-view-model';

@Component({
  selector: 'owl-novel-scene-right-panel',
  standalone: true,
  imports: [
    FormsModule,
    TranslateModule,
    ContentEditableDirective,
    NovelPovComponent
],
  templateUrl: './novel-scene-right-panel.component.html',
  styleUrls: ['./novel-scene-right-panel.component.scss'],
})
export class NovelSceneRightPanelComponent extends BaseRightPaneComponent<NovelScenePageViewModel | null> {
  private readonly novelStore = inject(NovelStore);

  get outline(): string {
    return this.data()?.outline ?? '';
  }

  async updateOutline(content: string): Promise<void> {
    const scene = this.data();
    if (!scene || scene.outline === content) {
      return;
    }
    await this.novelStore.updateSceneOutline(
      scene.chapterId,
      scene.sceneId,
      content
    );
  }

  async updateNotes(content: string): Promise<void> {
    const scene = this.data();
    if (!scene || scene.notes === content) {
      return;
    }
    await this.novelStore.updateSceneNotes(
      scene.chapterId,
      scene.sceneId,
      content
    );
  }

  async updatePov(characterId: string | undefined): Promise<void> {
    const scene = this.data();
    if (!scene) {
      return;
    }
    await this.novelStore.updateScenePov(
      scene.chapterId,
      scene.sceneId,
      characterId
    );
  }
}
