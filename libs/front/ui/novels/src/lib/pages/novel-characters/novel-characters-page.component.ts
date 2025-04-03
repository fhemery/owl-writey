import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  NotificationService,
} from '@owl/front/ui/common';

import { NovelCharacterViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';
import { NovelCorkboardComponent } from '../novel-main/components/novel-corkboard/novel-corkboard.component';
import { NovelCharacterCardComponent } from './components/novel-character-card/novel-character-card.component';

@Component({
  selector: 'owl-novel-characters-page',
  imports: [
    CommonModule,
    TranslateModule,
    NovelCorkboardComponent,
    NovelCharacterCardComponent,
  ],
  templateUrl: './novel-characters-page.component.html',
  styleUrl: './novel-characters-page.component.scss',
})
export class NovelCharactersPageComponent {
  readonly #confirmDialogService = inject(ConfirmDialogService);
  readonly #notificationService = inject(NotificationService);
  readonly #novelContext = inject(NovelContextService);
  readonly #novelStore = inject(NovelStore);
  readonly novel = this.#novelStore.novel;
  readonly characters = computed(
    () => this.novel()?.universe?.characters ?? []
  );
  readonly allTags = computed(() => {
    const tags =
      this.novel()?.universe?.characters.flatMap((c) => c.tags) ?? [];
    return [...new Set(tags)];
  });

  constructor() {
    this.#novelContext.reset();
  }

  async addCharacterAt(index: number): Promise<void> {
    await this.#novelStore.addCharacterAt(index);
  }
  async updateCharacter(character: NovelCharacterViewModel): Promise<void> {
    await this.#novelStore.updateCharacter(character);
  }
  convertToCharacter(item: unknown): NovelCharacterViewModel {
    return item as NovelCharacterViewModel;
  }
  async moveCharacter($event: { from: number; to: number }): Promise<void> {
    await this.#novelStore.moveCharacter($event.from, $event.to);
  }
  async deleteCharacter(character: NovelCharacterViewModel): Promise<void> {
    const confirmed = await this.#confirmDialogService.openConfirmDialog(
      'novel.character.deleteConfirm.title',
      'novel.character.deleteConfirm.text'
    );
    if (confirmed) {
      const isSuccess = await this.#novelStore.deleteCharacter(character.id);
      if (!isSuccess) {
        this.#notificationService.showError(
          'novel.character.deleteConfirm.result.error'
        );
      } else {
        this.#notificationService.showInfo(
          'novel.character.deleteConfirm.result.ok'
        );
      }
    }
  }
}
