import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import { NovelCharacterViewModel } from '../../../../model';

@Component({
  selector: 'owl-novel-character-card',
  imports: [CommonModule, TranslateModule, ContenteditableDirective, MatIcon],
  templateUrl: './novel-character-card.component.html',
  styleUrl: './novel-character-card.component.scss',
})
export class NovelCharacterCardComponent {
  readonly character = input.required<NovelCharacterViewModel>();
  readonly updateCharacter = output<NovelCharacterViewModel>();
  readonly deleteCharacter = output<void>();
  readonly moveCharacter = output<number>();

  updateCharacterDescription(description: string): void {
    if (description !== this.character().description) {
      const newCharacter = new NovelCharacterViewModel(
        this.character().id,
        this.character().name,
        description,
        this.character().tags
      );
      this.updateCharacter.emit(newCharacter);
    }
  }

  updateCharacterName(name: string): void {
    if (name !== this.character().name) {
      const newCharacter = new NovelCharacterViewModel(
        this.character().id,
        name,
        this.character().description,
        this.character().tags
      );
      this.updateCharacter.emit(newCharacter);
    }
  }

  onMoveCharacter(delta: number): void {
    this.moveCharacter.emit(delta);
  }

  onDeleteCharacter(): void {
    this.deleteCharacter.emit();
  }
}
