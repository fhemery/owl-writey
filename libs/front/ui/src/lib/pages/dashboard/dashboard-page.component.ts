import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ExerciseSummaryDto } from '@owl/shared/contracts';

import { DashboardExercisesComponent } from './components/dashboard-exercises/dashboard-exercises.component';
import { DashboardService } from './services/dashboard.service';

@Component({
  selector: 'owl-dashboard-page',
  imports: [
    CommonModule,
    DashboardExercisesComponent,
    MatIcon,
    MatSlideToggle,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  displayFinished = false;
  readonly dashboardService = inject(DashboardService);

  exercises = signal<ExerciseSummaryDto[] | null>(null);

  async ngOnInit(): Promise<void> {
    await this.reloadExercises();
  }

  async toggleFinished(): Promise<void> {
    console.log('toggling');
    this.displayFinished = !this.displayFinished;
    await this.reloadExercises();
  }

  async reloadExercises(): Promise<void> {
    const exercices = await this.dashboardService.getExercises({
      displayFinished: this.displayFinished,
    });
    this.exercises.set(exercices);
  }
}
