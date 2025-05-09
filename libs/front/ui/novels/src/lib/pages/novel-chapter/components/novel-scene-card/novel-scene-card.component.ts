import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  input,
  output,
  ViewChild,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';
import { Novel, NovelScene } from '@owl/shared/novels/model';
import {
  NovelCharacter,
  NovelSceneGeneralInfo,
} from '@owl/shared/novels/model';

import { NovelSelectPovComponent } from '../../../../components/novel-select-pov/novel-select-pov.component';

@Component({
  selector: 'owl-novel-scene-card',
  imports: [
    CommonModule,
    ContenteditableDirective,
    MatIcon,
    TranslateModule,
    MatMenuModule,
    NovelSelectPovComponent,
  ],
  templateUrl: './novel-scene-card.component.html',
  styleUrl: './novel-scene-card.component.scss',
})
export class NovelSceneCardComponent {
  readonly scene = input.required<NovelScene>();
  readonly novel = input.required<Novel>();
  readonly pov = computed(() => {
    const povId = this.scene()?.generalInfo.pov;
    return povId ? this.novel().findCharacter(povId) : null;
  });
  updateScene = output<NovelScene>();
  deleteScene = output<void>();
  moveScene = output<number>();
  transferScene = output<void>();
  goTo = output<void>();

  @ViewChild('titleElement') titleElement?: ElementRef;

  async updateTitle(title: string): Promise<void> {
    const newScene = new NovelScene(
      this.scene().id,
      new NovelSceneGeneralInfo(
        title,
        this.scene().generalInfo.outline,
        this.scene().generalInfo.pov
      ),
      this.scene().content
    );
    if (title !== this.scene().generalInfo.title) {
      this.updateScene.emit(newScene);
    }
  }

  updateOutline(outline: string): void {
    const newScene = new NovelScene(
      this.scene().id,
      new NovelSceneGeneralInfo(
        this.scene().generalInfo.title,
        outline,
        this.scene().generalInfo.pov
      ),
      this.scene().content
    );
    if (outline !== this.scene().generalInfo.outline) {
      this.updateScene.emit(newScene);
    }
  }
  updatePov(character: NovelCharacter | undefined): void {
    const id = character?.id;
    if (this.scene().generalInfo.pov === id) {
      return;
    }
    const newScene = new NovelScene(
      this.scene().id,
      new NovelSceneGeneralInfo(
        this.scene().generalInfo.title,
        this.scene().generalInfo.outline,
        id
      ),
      this.scene().content
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

  focus(): void {
    this.titleElement?.nativeElement?.click();
  }
}
