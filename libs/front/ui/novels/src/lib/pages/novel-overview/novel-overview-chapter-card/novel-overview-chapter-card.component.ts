import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { NovelChaptersViewModel } from '../../../model';

@Component({
  selector: 'owl-novel-overview-chapter-card',
  imports: [CommonModule],
  templateUrl: './novel-overview-chapter-card.component.html',
  styleUrl: './novel-overview-chapter-card.component.scss',
})
export class NovelOverviewChapterCardComponent {
  chapter = input.required<NovelChaptersViewModel>();
}
