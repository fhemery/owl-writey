import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

import { NovelCharacterViewModel } from '../../model';

@Component({
  selector: 'owl-novel-select-pov',
  imports: [CommonModule, MatIcon, TranslateModule],
  templateUrl: './novel-select-pov.component.html',
  styleUrl: './novel-select-pov.component.scss',
})
export class NovelSelectPovComponent {
  currentlySelectedId = input<string | undefined>(undefined);
  characters = input.required<NovelCharacterViewModel[]>();
  selectedCharacter = output<NovelCharacterViewModel | undefined>();

  select(character: NovelCharacterViewModel | undefined): void {
    this.selectedCharacter.emit(character);
  }
}
