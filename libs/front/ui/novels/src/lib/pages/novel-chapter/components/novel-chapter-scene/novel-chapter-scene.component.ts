import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import { NovelSelectPovComponent } from '../../../../components/novel-select-pov/novel-select-pov.component';
import {
  NovelCharacterViewModel,
  NovelSceneGeneralInfoViewModel,
  NovelSceneViewModel,
  NovelViewModel,
} from '../../../../model';

@Component({
  selector: 'owl-novel-chapter-scene',
  imports: [
    CommonModule,
    ContenteditableDirective,
    MatIcon,
    TranslateModule,
    MatMenuModule,
    NovelSelectPovComponent,
  ],
  templateUrl: './novel-chapter-scene.component.html',
  styleUrl: './novel-chapter-scene.component.scss',
})
export class NovelChapterSceneComponent {
  readonly scene = input.required<NovelSceneViewModel>();
  readonly novel = input.required<NovelViewModel>();
  readonly pov = computed(() => {
    const povId = this.scene()?.generalInfo.pov;
    return povId ? this.novel().findCharacter(povId) : null;
  });
  updateScene = output<NovelSceneViewModel>();
  deleteScene = output<void>();
  moveScene = output<number>();
  transferScene = output<void>();
  goTo = output<void>();

  async updateTitle(title: string): Promise<void> {
    const newScene = new NovelSceneViewModel(
      this.scene().id,
      new NovelSceneGeneralInfoViewModel(
        title,
        this.scene().generalInfo.outline,
        this.scene().generalInfo.pov
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
        outline,
        this.scene().generalInfo.pov
      ),
      this.scene().text
    );
    if (outline !== this.scene().generalInfo.outline) {
      this.updateScene.emit(newScene);
    }
  }
  updatePov(character: NovelCharacterViewModel | undefined): void {
    const id = character?.id;
    if (this.scene().generalInfo.pov === id) {
      return;
    }
    const newScene = new NovelSceneViewModel(
      this.scene().id,
      new NovelSceneGeneralInfoViewModel(
        this.scene().generalInfo.title,
        this.scene().generalInfo.outline,
        id
      ),
      this.scene().text
    );
    this.updateScene.emit(newScene);
  }

  onDeleteScene(): void {
    this.deleteScene.emit();
  }

  onMoveScene(delta: number): void {
    this.moveScene.emit(delta);
  }

  onTransferScene(): void {
    this.transferScene.emit();
  }

  goToScene(): void {
    this.goTo.emit();
  }
}
