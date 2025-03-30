import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ExerciseStatus,
  ExerciseSummaryDto,
} from '@owl/shared/exercises/contracts';

@Component({
  selector: 'owl-dashboard-exercise-card',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatCardFooter,
    MatIcon,
    MatTooltip,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './dashboard-exercise-card.component.html',
  styleUrl: './dashboard-exercise-card.component.scss',
})
export class DashboardExerciseCardComponent {
  ExerciseStatus = ExerciseStatus;
  exercise = input.required<ExerciseSummaryDto>();
}
