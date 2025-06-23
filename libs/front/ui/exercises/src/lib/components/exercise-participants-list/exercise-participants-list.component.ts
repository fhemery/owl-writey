
import { Component, input, signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto } from '@owl/shared/exercises/contracts';

@Component({
  selector: 'owl-exercise-participants-list',
  imports: [
    TranslateModule,
    MatButton,
    MatIcon,
    MatTooltipModule
],
  templateUrl: './exercise-participants-list.component.html',
  styleUrl: './exercise-participants-list.component.scss',
})
export class ExerciseParticipantsListComponent {
  exercise = input.required<ExerciseDto>();
  isListCollapsed = signal(true);

  toggleList(): void {
    this.isListCollapsed.update((value) => !value);
  }
}
