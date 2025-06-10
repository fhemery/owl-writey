import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelStore } from '../../services/novel.store';
import { NovelContextService } from '../../services/novel-context.service';

@Component({
  selector: 'owl-novel-settings-page',
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './novel-settings-page.component.html',
  styleUrl: './novel-settings-page.component.scss',
})
export class NovelSettingsPageComponent {
  readonly #novelContext = inject(NovelContextService);
  readonly #novelStore = inject(NovelStore);
  readonly id = computed(() => this.#novelStore.novel()?.id);

  constructor() {
    this.#novelContext.reset();
  }
}
