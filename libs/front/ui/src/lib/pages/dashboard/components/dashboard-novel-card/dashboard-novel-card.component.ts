import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { NovelSummaryDto } from '@owl/shared/contracts';

@Component({
  selector: 'owl-dashboard-novel-card',
  imports: [CommonModule],
  templateUrl: './dashboard-novel-card.component.html',
  styleUrl: './dashboard-novel-card.component.scss',
})
export class DashboardNovelCardComponent {
  novel = input.required<NovelSummaryDto>();
}
