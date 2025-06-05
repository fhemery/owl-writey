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
  NotificationService,
} from '@owl/front/ui/common';
import { firstValueFrom } from 'rxjs';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelChapterHeaderComponent } from './components/novel-chapter-header/novel-chapter-header.component';
import { NovelSceneCardComponent } from './components/novel-scene-card/novel-scene-card.component';
import { TransferSceneDialogComponent } from './components/transfer-scene-dialog/transfer-scene-dialog.component';
import {
  ChapterPageSceneViewModel,
  ChapterPageViewModel,
} from './model/chapter-page.view-model';

@Component({
  selector: 'owl-novel-chapter-page',
  imports: [
    CommonModule,
    NovelCorkboardComponent,
    TranslateModule,
    NovelSceneCardComponent,
    NovelChapterHeaderComponent,
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
    ChapterPageViewModel.From(this.novel(), this.chapterId())
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

  convertToScene(item: unknown): ChapterPageSceneViewModel {
    return item as ChapterPageSceneViewModel;
  }

  async updateSceneTitle(title: string, sceneId: string): Promise<void> {
    await this.#store.updateSceneTitle(this.chapterId(), sceneId, title);
  }

  async updateSceneOutline(outline: string, sceneId: string): Promise<void> {
    await this.#store.updateSceneOutline(this.chapterId(), sceneId, outline);
  }

  async updateScenePov(
    povId: string | undefined,
    sceneId: string
  ): Promise<void> {
    await this.#store.updateScenePov(this.chapterId(), sceneId, povId);
  }

  async updateChapterTitle(title: string): Promise<void> {
    const currentChapter = this.chapter();
    if (!currentChapter || currentChapter.title === title) {
      return;
    }
    await this.#store.updateChapterTitle(this.chapterId(), title);
  }

  async moveScene($event: { from: number; to: number }): Promise<void> {
    const sceneId = this.chapter()?.scenes[$event.from].id;
    if (!sceneId) {
      return;
    }
    await this.#store.moveScene(this.chapterId(), sceneId, $event.to);
  }

  async deleteScene(sceneId: string): Promise<void> {
    const confirmed = await this.#confirmDialogService.openConfirmDialog(
      'novel.scene.deleteConfirm.title',
      'novel.scene.deleteConfirm.text'
    );
    if (confirmed) {
      const isSuccess = await this.#store.deleteScene(
        this.chapterId(),
        sceneId
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

  async transferScene(sceneId: string): Promise<void> {
    const transferResult: { chapterId: string; sceneIndex: number } =
      await firstValueFrom(
        this.#dialog
          .open(TransferSceneDialogComponent, {
            data: {
              scene: this.novel()?.findScene(this.chapterId(), sceneId),
            },
          })
          .afterClosed()
      );
    if (!transferResult) {
      return;
    }
    await this.#store.transferScene(
      this.chapterId(),
      sceneId,
      transferResult.chapterId,
      transferResult.sceneIndex
    );
  }

  async goToScene(sceneId: string): Promise<void> {
    await this.#router.navigate([
      'novels',
      this.novel()?.id || '',
      'chapters',
      this.chapterId(),
      'scenes',
      sceneId,
    ]);
  }

  async goToChapter(chapterId: string): Promise<void> {
    await this.#router.navigate([
      'novels',
      this.novel()?.id || '',
      'chapters',
      chapterId,
    ]);
  }
}
