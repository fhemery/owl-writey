import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import {
  NovelSceneGeneralInfoViewModel,
  NovelSceneViewModel,
} from '../../../../model';

@Component({
  selector: 'owl-novel-chapter-scene',
  imports: [CommonModule, ContenteditableDirective, MatIcon, TranslateModule],
  templateUrl: './novel-chapter-scene.component.html',
  styleUrl: './novel-chapter-scene.component.scss',
})
export class NovelChapterSceneComponent {
  readonly scene = input.required<NovelSceneViewModel>();
  updateScene = output<NovelSceneViewModel>();
  deleteScene = output<void>();

  async updateTitle(title: string): Promise<void> {
    const newScene = new NovelSceneViewModel(
      this.scene().id,
      new NovelSceneGeneralInfoViewModel(
        title,
        this.scene().generalInfo.outline
      ),
      this.scene().text
    );
    if (title !== this.scene().generalInfo.title) {
      this.updateScene.emit(newScene);
    }
  }

  updateOutline(outline: string): void {
    const newScene = new NovelSceneViewModel(
      this.scene().id,
      new NovelSceneGeneralInfoViewModel(
        this.scene().generalInfo.title,
        outline
      ),
      this.scene().text
    );
    if (outline !== this.scene().generalInfo.outline) {
      this.updateScene.emit(newScene);
    }
  }

  onDeleteScene(): void {
    this.deleteScene.emit();
  }
}
