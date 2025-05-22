import { CommonModule } from '@angular/common';
import {
  Component,
  computed,
  inject,
  QueryList,
  signal,
  ViewChildren,
} from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogService,
  NotificationService,
} from '@owl/front/ui/common';
import { NovelCharacter } from '@owl/shared/novels/model';

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
    MatChipsModule,
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
    () =>
      this.novel()?.universe?.characters.filter(
        (c) =>
          this.selectedTags().length === 0 ||
          c.tags.some((tag) => this.selectedTags().includes(tag))
      ) ?? []
  );
  readonly allTags = computed(() => {
    const tags =
      this.novel()?.universe?.characters.flatMap((c) => c.tags) ?? [];
    return [...new Set(tags)].sort();
  });
  readonly selectedTags = signal<string[]>([]);

  @ViewChildren(NovelCharacterCardComponent)
  characterCards?: QueryList<NovelCharacterCardComponent>;

  constructor() {
    this.#novelContext.reset();
  }

  async addCharacterAt(index: number): Promise<void> {
    await this.#novelStore.addCharacterAt(index);
    setTimeout(() => this.focusCharacterAt(index), 50);
  }
  async updateCharacter(character: NovelCharacter): Promise<void> {
    await this.#novelStore.updateCharacter(character);
  }
  convertToCharacter(item: unknown): NovelCharacter {
    return item as NovelCharacter;
  }
  async moveCharacter($event: { from: number; to: number }): Promise<void> {
    const character = this.novel()?.universe?.characters[$event.from];
    if (!character) {
      return;
    }
    await this.#novelStore.moveCharacter(character.id, $event.to);
  }
  async deleteCharacter(character: NovelCharacter): Promise<void> {
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
  toggleTag(tag: string): void {
    if (this.selectedTags().includes(tag)) {
      this.selectedTags.update((tags) => tags.filter((t) => t !== tag));
    } else {
      this.selectedTags.update((tags) => [...tags, tag]);
    }
  }

  private focusCharacterAt(index?: number): void {
    if (index === undefined) {
      index = (this.characterCards?.length ?? 0) - 1;
    }
    this.characterCards?.get(index)?.focus();
  }
}
