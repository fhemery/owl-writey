import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  Component,
  computed,
  ElementRef,
  input,
  model,
  output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormField } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ContentEditableDirective } from '@owl/front/ui/common';
import { NovelCharacter } from '@owl/shared/novels/model';

@Component({
  selector: 'owl-novel-character-card',
  imports: [
    TranslateModule,
    ContentEditableDirective,
    MatIcon,
    MatAutocompleteModule,
    FormsModule,
    MatChipsModule,
    MatFormField,
    MatTooltip,
  ],
  templateUrl: './novel-character-card.component.html',
  styleUrl: './novel-character-card.component.scss',
})
export class NovelCharacterCardComponent {
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly character = input.required<NovelCharacter>();
  readonly allTags = input<string[]>([]);
  readonly updateCharacter = output<NovelCharacter>();
  readonly deleteCharacter = output<void>();
  readonly moveCharacter = output<number>();

  @ViewChild('titleElement') titleElement?: ElementRef;

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
      const newCharacter = new NovelCharacter(
        this.character().id,
        this.character().name,
        description,
        this.character().tags,
        this.character().properties
      );
      this.updateCharacter.emit(newCharacter);
    }
  }

  updateCharacterName(name: string): void {
    if (name !== this.character().name) {
      const newCharacter = new NovelCharacter(
        this.character().id,
        name,
        this.character().description,
        this.character().tags,
        this.character().properties
      );
      this.updateCharacter.emit(newCharacter);
    }
  }

  updateCharacterColor($event: Event): void {
    const newCharacter = new NovelCharacter(
      this.character().id,
      this.character().name,
      this.character().description,
      this.character().tags,
      {
        ...this.character().properties,
        color: ($event.target as HTMLInputElement).value,
      }
    );
    this.updateCharacter.emit(newCharacter);
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
    const newCharacter = new NovelCharacter(
      this.character().id,
      this.character().name,
      this.character().description,
      [...this.character().tags, newTag],
      this.character().properties
    );
    this.updateCharacter.emit(newCharacter);
  }
  removeTag(tag: string): void {
    const newCharacter = new NovelCharacter(
      this.character().id,
      this.character().name,
      this.character().description,
      this.character().tags.filter((t) => t !== tag),
      this.character().properties
    );
    this.updateCharacter.emit(newCharacter);
  }

  focus(): void {
    this.titleElement?.nativeElement?.click();
  }
}
