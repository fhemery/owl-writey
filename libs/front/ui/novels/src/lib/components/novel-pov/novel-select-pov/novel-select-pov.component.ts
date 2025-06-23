import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

export interface SelectPovModel {
  readonly id: string;
  readonly name: string;
}

@Component({
  selector: 'owl-novel-select-pov',
  imports: [CommonModule, MatIcon, MatTooltip, TranslateModule],
  templateUrl: './novel-select-pov.component.html',
  styleUrl: './novel-select-pov.component.scss',
})
export class NovelSelectPovComponent {
  currentlySelectedId = input<string | undefined>(undefined);
  characters = input.required<SelectPovModel[]>();
  selectedCharacter = output<string | undefined>();

  select(character: SelectPovModel | undefined): void {
    this.selectedCharacter.emit(character?.id);
  }
}
