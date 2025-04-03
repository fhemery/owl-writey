import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';

@Component({
  selector: 'owl-novel-characters-page',
  imports: [CommonModule],
  templateUrl: './novel-characters-page.component.html',
  styleUrl: './novel-characters-page.component.scss',
})
export class NovelCharactersPageComponent {
  readonly #novelContext = inject(NovelContextService);
  readonly #novelStore = inject(NovelStore);
  readonly novel = this.#novelStore.novel;
  readonly characters = computed(
    () => this.novel()?.universe?.characters ?? []
  );

  constructor() {
    this.#novelContext.reset();
  }
}
