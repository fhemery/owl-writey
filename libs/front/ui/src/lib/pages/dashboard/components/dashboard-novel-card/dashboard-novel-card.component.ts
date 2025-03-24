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
import { NovelSummaryDto } from '@owl/shared/contracts';

@Component({
  selector: 'owl-dashboard-novel-card',
  imports: [
    CommonModule,
    MatCard,
    MatCardHeader,
    MatCardFooter,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './dashboard-novel-card.component.html',
  styleUrl: './dashboard-novel-card.component.scss',
})
export class DashboardNovelCardComponent {
  novel = input.required<NovelSummaryDto>();
}
