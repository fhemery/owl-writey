import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  effect,
  inject,
  input,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  ContenteditableDirective,
  NotificationService,
} from '@owl/front/ui/common';
import { NovelScene } from '@owl/shared/novels/model';
import { firstValueFrom } from 'rxjs';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelSceneCardComponent } from './components/novel-scene-card/novel-scene-card.component';
import { TransferSceneDialogComponent } from './components/transfer-scene-dialog/transfer-scene-dialog.component';

@Component({
  selector: 'owl-novel-chapter-page',
  imports: [
    CommonModule,
    NovelCorkboardComponent,
    TranslateModule,
    NovelSceneCardComponent,
    ContenteditableDirective,
  ],
  templateUrl: './novel-chapter-page.component.html',
  styleUrl: './novel-chapter-page.component.scss',
})
export class NovelChapterPageComponent {
  readonly #router = inject(Router);
  readonly chapterId = input.required<string>();
  readonly #store = inject(NovelStore);
  readonly #dialog = inject(MatDialog);
  readonly #novelContext = inject(NovelContextService);
  readonly #confirmDialogService = inject(ConfirmDialogService);
  readonly #notificationService = inject(NotificationService);
  readonly novel = this.#store.novel;
  readonly chapter = computed(() =>
    this.novel()?.chapters.find((chapter) => chapter.id === this.chapterId())
  );

  @ViewChildren(NovelSceneCardComponent)
  sceneCards!: QueryList<NovelSceneCardComponent>;

  constructor() {
    effect(() => {
      this.#novelContext.setChapter(this.chapterId());
    });
  }

  async addSceneAt(index?: number): Promise<void> {
    await this.#store.addSceneAt(this.chapterId(), index);
    setTimeout(() => this.focusSceneAt(index), 50);
  }

  private focusSceneAt(index?: number): void {
    if (this.sceneCards && this.sceneCards.length > 0) {
      if (index === undefined) {
        index = this.sceneCards.length - 1;
      }
      this.sceneCards.get(index)?.focus();
    }
  }

  convertToScene(item: unknown): NovelScene {
    return item as NovelScene;
  }

  async updateScene(
    initialScene: NovelScene,
    newScene: NovelScene
  ): Promise<void> {
    if (initialScene.generalInfo.title !== newScene.generalInfo.title) {
      await this.#store.updateSceneTitle(
        this.chapterId(),
        initialScene.id,
        newScene.generalInfo.title
      );
    } else if (
      initialScene.generalInfo.outline !== newScene.generalInfo.outline
    ) {
      await this.#store.updateSceneOutline(
        this.chapterId(),
        initialScene.id,
        newScene.generalInfo.outline
      );
    } else {
      await this.#store.updateScene(this.chapterId(), newScene);
    }
  }

  async updateChapterTitle(title: string): Promise<void> {
    const currentChapter = this.chapter();
    if (!currentChapter || currentChapter.generalInfo.title === title) {
      return;
    }
  }

  async moveScene($event: { from: number; to: number }): Promise<void> {
    const sceneId = this.chapter()?.scenes[$event.from].id;
    if (!sceneId) {
      return;
    }
    await this.#store.doMoveScene(this.chapterId(), sceneId, $event.to);
  }

  async deleteScene(scene: NovelScene): Promise<void> {
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

  async transferScene(scene: NovelScene): Promise<void> {
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

  async goToScene(scene: NovelScene): Promise<void> {
    await this.#router.navigate([
      'novels',
      this.novel()?.id || '',
      'chapters',
      this.chapterId(),
      'scenes',
      scene.id,
    ]);
  }
}
