import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE } from '@owl/front/auth';
import { LocalConfigService } from '@owl/front/ui/common';
// TODO : Split into exercises and novels
import {
  ExerciseStatus,
  ExerciseSummaryDto,
} from '@owl/shared/exercises/contracts';
import { NovelSummaryDto } from '@owl/shared/novels/contracts';

import { DashboardExercisesComponent } from '../../components/dashboard-exercises/dashboard-exercises.component';
import { DashboardNovelsComponent } from '../../components/dashboard-novels/dashboard-novels.component';
import { DashboardService } from '../../services/dashboard.service';

export const DASHBOARD_CONFIG_KEY = 'dashboard.config';
interface DashboardConfig {
  displayFinished?: boolean;
}

@Component({
  selector: 'owl-dashboard-page',
  imports: [
    DashboardExercisesComponent,
    MatIcon,
    MatSlideToggle,
    MatTooltip,
    TranslateModule,
    RouterLink,
    DashboardNovelsComponent,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent implements OnInit {
  readonly dashboardService = inject(DashboardService);

  readonly authService = inject(AUTH_SERVICE);
  readonly user = this.authService.user;

  readonly localConfigService = inject(LocalConfigService);
  readonly config =
    this.localConfigService.getUpdates<DashboardConfig>(DASHBOARD_CONFIG_KEY);
  displayFinished = computed(() => this.config().displayFinished ?? false);

  exercises = signal<ExerciseSummaryDto[] | null>(null);
  novels = signal<NovelSummaryDto[] | null>(null);

  async ngOnInit(): Promise<void> {
    await Promise.all([this.reloadExercises(), this.reloadNovels()]);
  }

  async toggleFinished(): Promise<void> {
    this.localConfigService.update(DASHBOARD_CONFIG_KEY, {
      displayFinished: !this.displayFinished(),
    });
    await this.reloadExercises();
  }

  async reloadExercises(): Promise<void> {
    const exercises = await this.dashboardService.getExercises({
      displayFinished: this.displayFinished(),
    });
    return this.exercises.set(this.sortExercises(exercises));
  }

  private sortExercises(exercises: ExerciseSummaryDto[]): ExerciseSummaryDto[] {
    return exercises.sort((a, b) => {
      if (a.status === b.status) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      }
      return b.status === ExerciseStatus.Finished ? -1 : 1;
    });
  }

  async reloadNovels(): Promise<void> {
    const novels = await this.dashboardService.getNovels();
    return this.novels.set(novels);
  }
}
