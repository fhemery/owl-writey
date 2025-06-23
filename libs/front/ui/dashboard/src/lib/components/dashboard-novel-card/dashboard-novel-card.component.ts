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
import { NovelSummaryDto } from '@owl/shared/novels/contracts';

@Component({
  selector: 'owl-dashboard-novel-card',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardFooter,
    MatCardTitle,
    MatCardContent,
    MatIcon,
    MatTooltip,
    RouterLink,
    TranslateModule,
  ],
  templateUrl: './dashboard-novel-card.component.html',
  styleUrl: './dashboard-novel-card.component.scss',
})
export class DashboardNovelCardComponent {
  novel = input.required<NovelSummaryDto>();
}
