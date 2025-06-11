import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { BaseRightPaneComponent } from '@owl/front/ui/common';

import { NovelPovComponent } from '../../../../components/novel-pov/novel-pov.component';
import { NovelStore } from '../../../../services/novel.store';
import { NovelScenePageViewModel } from '../../view-model/novel-scene-page-view-model';

@Component({
  selector: 'owl-novel-scene-right-panel',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TextFieldModule,
    TranslateModule,
    CdkTextareaAutosize,
    NovelPovComponent,
  ],
  templateUrl: './novel-scene-right-panel.component.html',
  styleUrls: ['./novel-scene-right-panel.component.scss'],
})
export class NovelSceneRightPanelComponent extends BaseRightPaneComponent<NovelScenePageViewModel | null> {
  private readonly novelStore = inject(NovelStore);

  get outline(): string {
    return this.data()?.outline ?? '';
  }

  async updateOutline(event: Event): Promise<void> {
    const outline = (event.target as HTMLTextAreaElement).value;
    const scene = this.data();
    if (!scene) {
      return;
    }
    await this.novelStore.updateSceneOutline(
      scene.chapterId,
      scene.sceneId,
      outline
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
