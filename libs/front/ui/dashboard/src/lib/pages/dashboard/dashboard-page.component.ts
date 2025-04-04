import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE } from '@owl/front/auth';
// TODO : Split into exercises and novels
import { ExerciseSummaryDto } from '@owl/shared/exercises/contracts';
import { NovelSummaryDto } from '@owl/shared/novels/contracts';

import { DashboardExercisesComponent } from '../../components/dashboard-exercises/dashboard-exercises.component';
import { DashboardNovelsComponent } from '../../components/dashboard-novels/dashboard-novels.component';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'owl-dashboard-page',
  imports: [
    CommonModule,
    DashboardExercisesComponent,
    MatIcon,
    MatSlideToggle,
    TranslateModule,
    RouterLink,
    DashboardNovelsComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  displayFinished = false;
  readonly dashboardService = inject(DashboardService);
  readonly authService = inject(AUTH_SERVICE);
  user = this.authService.user;

  exercises = signal<ExerciseSummaryDto[] | null>(null);
  novels = signal<NovelSummaryDto[] | null>(null);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.reloadExercises(), this.reloadNovels()]);
  }

  async toggleFinished(): Promise<void> {
    this.displayFinished = !this.displayFinished;
    await this.reloadExercises();
  }

  async reloadExercises(): Promise<void> {
    const exercises = await this.dashboardService.getExercises({
      displayFinished: this.displayFinished,
    });
    return this.exercises.set(exercises);
  }

  async reloadNovels(): Promise<void> {
    const novels = await this.dashboardService.getNovels();
    return this.novels.set(novels);
  }
}
