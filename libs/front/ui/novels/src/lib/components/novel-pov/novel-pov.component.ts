import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

import { NovelPovCharacterViewModel } from './model/novel-pov-character.view-model';
import { NovelSelectPovComponent } from './novel-select-pov/novel-select-pov.component';

@Component({
  selector: 'owl-novel-pov',
  imports: [
    CommonModule,
    NovelSelectPovComponent,
    MatMenuModule,
    TranslateModule,
    MatIcon,
  ],
  templateUrl: './novel-pov.component.html',
  styleUrl: './novel-pov.component.scss',
})
export class NovelPovComponent {
  povId = input<string | undefined>();
  characters = input.required<NovelPovCharacterViewModel[]>();
  updatePov = output<string | undefined>();

  selectedCharacter = computed(() => {
    return this.characters().find((c) => c.id === this.povId());
  });

  doUpdate(characterId: string | undefined): void {
    this.updatePov.emit(characterId);
  }
}
