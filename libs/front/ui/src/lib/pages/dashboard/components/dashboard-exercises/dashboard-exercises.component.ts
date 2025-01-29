import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto } from '@owl/shared/contracts';

import { DashboardExerciseCardComponent } from '../dashboard-exercise-card/dashboard-exercise-card.component';

@Component({
  selector: 'owl-dashboard-exercises',
  imports: [CommonModule, TranslateModule, DashboardExerciseCardComponent],
  templateUrl: './dashboard-exercises.component.html',
  styleUrl: './dashboard-exercises.component.scss',
})
export class DashboardExercisesComponent {
  exercises = input<ExerciseDto[] | null>();
}
