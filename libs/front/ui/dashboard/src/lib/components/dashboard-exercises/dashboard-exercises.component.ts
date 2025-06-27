
import { Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseSummaryDto } from '@owl/shared/exercises/contracts';

import { DashboardExerciseCardComponent } from '../dashboard-exercise-card/dashboard-exercise-card.component';

@Component({
  selector: 'owl-dashboard-exercises',
  imports: [TranslateModule, DashboardExerciseCardComponent],
  templateUrl: './dashboard-exercises.component.html',
  styleUrl: './dashboard-exercises.component.scss',
})
export class DashboardExercisesComponent {
  exercises = input<ExerciseSummaryDto[] | null>();
}
