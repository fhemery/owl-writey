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

import { NovelPovCharacterViewModel } from '../../../../components/novel-pov/model/novel-pov-character.view-model';
import { NovelPovComponent } from '../../../../components/novel-pov/novel-pov.component';
import {
  ChapterPageCharacterViewModel,
  ChapterPageSceneViewModel,
} from '../../model/chapter-page.view-model';

@Component({
  selector: 'owl-novel-scene-card',
  imports: [
    CommonModule,
    ContenteditableDirective,
    MatIcon,
    TranslateModule,
    MatMenuModule,
    NovelPovComponent,
  ],
  templateUrl: './novel-scene-card.component.html',
  styleUrl: './novel-scene-card.component.scss',
})
export class NovelSceneCardComponent {
  readonly scene = input.required<ChapterPageSceneViewModel>();
  readonly characters = input<ChapterPageCharacterViewModel[]>([]);

  povCharacter = computed(() => {
    return this.characters().map(
      (c) => new NovelPovCharacterViewModel(c.id, c.name, c.color)
    );
  });

  updateSceneTitle = output<string>();
  updateSceneOutline = output<string>();
  updateScenePov = output<string | undefined>();
  deleteScene = output<void>();
  moveScene = output<number>();
  transferScene = output<void>();
  goTo = output<void>();

  @ViewChild('titleElement') titleElement?: ElementRef;

  async updateTitle(title: string): Promise<void> {
    if (title !== this.scene().title) {
      this.updateSceneTitle.emit(title);
    }
  }

  updateOutline(outline: string): void {
    if (outline !== this.scene().outline) {
      this.updateSceneOutline.emit(outline);
    }
  }

  updatePov(characterId: string | undefined): void {
    if (this.scene().pov?.id === characterId) {
      return;
    }
    this.updateScenePov.emit(characterId);
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
