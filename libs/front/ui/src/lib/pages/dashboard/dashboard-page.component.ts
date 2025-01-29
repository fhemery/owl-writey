import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DashboardExercisesComponent } from './components/dashboard-exercises.component';

@Component({
  selector: 'owl-dashboard-page',
  imports: [
    CommonModule,
    DashboardExercisesComponent,
    MatIcon,
    TranslateModule,
    RouterLink,
  ],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
})
export class DashboardPageComponent {}
