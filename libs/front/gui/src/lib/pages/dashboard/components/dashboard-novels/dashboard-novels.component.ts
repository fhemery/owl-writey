import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { NovelSummaryDto } from '@owl/shared/contracts';

import { DashboardNovelCardComponent } from '../dashboard-novel-card/dashboard-novel-card.component';

@Component({
  selector: 'owl-dashboard-novels',
  imports: [CommonModule, TranslatePipe, DashboardNovelCardComponent],
  templateUrl: './dashboard-novels.component.html',
  styleUrl: './dashboard-novels.component.scss',
})
export class DashboardNovelsComponent {
  novels = input.required<NovelSummaryDto[] | null>();
}
