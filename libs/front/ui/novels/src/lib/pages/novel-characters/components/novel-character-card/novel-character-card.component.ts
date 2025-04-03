import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { CommonModule } from '@angular/common';
import { Component, computed, input, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { ContenteditableDirective } from '@owl/front/ui/common';

import { NovelCharacterViewModel } from '../../../../model';

@Component({
  selector: 'owl-novel-character-card',
  imports: [
    CommonModule,
    TranslateModule,
    ContenteditableDirective,
    MatIcon,
    MatAutocompleteModule,
    FormsModule,
    MatChipsModule,
    MatFormField,
  ],
  templateUrl: './novel-character-card.component.html',
  styleUrl: './novel-character-card.component.scss',
})
export class NovelCharacterCardComponent {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly character = input.required<NovelCharacterViewModel>();
  readonly allTags = input<string[]>([]);
  readonly updateCharacter = output<NovelCharacterViewModel>();
  readonly deleteCharacter = output<void>();
  readonly moveCharacter = output<number>();

  readonly currentTag = model('');
  readonly filteredTags = computed(() => {
    if (this.currentTag().length < 2) {
      return [];
    }
    return this.allTags().filter(
      (tag) =>
        !this.character().tags.includes(tag) &&
        tag.toLowerCase().includes(this.currentTag().toLowerCase())
    );
  });

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

  addTag(newTag: string): void {
    if (!newTag || this.character().tags.includes(newTag)) {
      return;
    }
    const newCharacter = new NovelCharacterViewModel(
      this.character().id,
      this.character().name,
      this.character().description,
      [...this.character().tags, newTag]
    );
    this.updateCharacter.emit(newCharacter);
  }
  removeTag(tag: string): void {
    const newCharacter = new NovelCharacterViewModel(
      this.character().id,
      this.character().name,
      this.character().description,
      this.character().tags.filter((t) => t !== tag)
    );
    this.updateCharacter.emit(newCharacter);
  }
}
