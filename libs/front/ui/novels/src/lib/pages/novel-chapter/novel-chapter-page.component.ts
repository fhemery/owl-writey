import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  ContenteditableDirective,
  NotificationService,
} from '@owl/front/ui/common';
import { firstValueFrom } from 'rxjs';

import { NovelChapterViewModel, NovelSceneViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelChapterSceneComponent } from './components/novel-chapter-scene/novel-chapter-scene.component';
import { TransferSceneDialogComponent } from './components/transfer-scene-dialog/transfer-scene-dialog.component';

@Component({
  selector: 'owl-novel-chapter-page',
  imports: [
    CommonModule,
    NovelCorkboardComponent,
    TranslateModule,
    NovelChapterSceneComponent,
    ContenteditableDirective,
  ],
  templateUrl: './novel-chapter-page.component.html',
  styleUrl: './novel-chapter-page.component.scss',
})
export class NovelChapterPageComponent {
  readonly chapterId = input.required<string>();
  readonly #store = inject(NovelStore);
  readonly #dialog = inject(MatDialog);
  readonly #confirmDialogService = inject(ConfirmDialogService);
  readonly #notificationService = inject(NotificationService);
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

  async updateChapterTitle(title: string): Promise<void> {
    const currentChapter = this.chapter();
    if (!currentChapter || currentChapter.title === title) {
      return;
    }

    await this.#store.updateChapter(
      new NovelChapterViewModel(
        currentChapter.id,
        title,
        currentChapter.outline,
        currentChapter.scenes
      )
    );
  }

  async moveScene($event: { from: number; to: number }): Promise<void> {
    await this.#store.moveScene(this.chapterId(), $event.from, $event.to);
  }

  async deleteScene(scene: NovelSceneViewModel): Promise<void> {
    const confirmed = await this.#confirmDialogService.openConfirmDialog(
      'novel.scene.deleteConfirm.title',
      'novel.scene.deleteConfirm.text'
    );
    if (confirmed) {
      const isSuccess = await this.#store.deleteScene(
        this.chapterId(),
        scene.id
      );
      if (!isSuccess) {
        this.#notificationService.showError(
          'novel.scene.deleteConfirm.result.error'
        );
      } else {
        this.#notificationService.showInfo(
          'novel.scene.deleteConfirm.result.ok'
        );
      }
    }
  }

  async transferScene(scene: NovelSceneViewModel): Promise<void> {
    const transferResult: { chapterId: string; sceneIndex: number } =
      await firstValueFrom(
        this.#dialog
          .open(TransferSceneDialogComponent, {
            data: {
              scene,
            },
          })
          .afterClosed()
      );
    if (!transferResult) {
      return;
    }
    await this.#store.transferScene(
      this.chapterId(),
      scene.id,
      transferResult.chapterId,
      transferResult.sceneIndex
    );
  }
}
