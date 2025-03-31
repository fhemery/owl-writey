import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

import {
  NovelSceneGeneralInfoViewModel,
  NovelSceneViewModel,
} from '../../../../model';

@Component({
  selector: 'owl-novel-chapter-scene',
  imports: [CommonModule],
  templateUrl: './novel-chapter-scene.component.html',
  styleUrl: './novel-chapter-scene.component.scss',
})
export class NovelChapterSceneComponent {
  readonly scene = input.required<NovelSceneViewModel>();
  updateScene = output<NovelSceneViewModel>();

  updateTitle($event: Event): void {
    const title = this.getValue($event);
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
    ($event.target as HTMLInputElement).scrollLeft = 0;
  }

  updateOutline($event: Event): void {
    const outline = this.getValue($event);
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
    ($event.target as HTMLInputElement).scrollLeft = 0;
    ($event.target as HTMLInputElement).scrollTop = 0;
  }

  private getValue($event: Event): string {
    return (($event as InputEvent).target as HTMLInputElement).innerHTML;
  }
}
