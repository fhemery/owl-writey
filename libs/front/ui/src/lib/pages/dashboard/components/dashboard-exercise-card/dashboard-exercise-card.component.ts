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
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseDto } from '@owl/shared/contracts';

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
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './dashboard-exercise-card.component.html',
  styleUrl: './dashboard-exercise-card.component.scss',
})
export class DashboardExerciseCardComponent {
  exercise = input.required<ExerciseDto>();
}
