import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { NovelViewModel } from '../../../../model';

@Component({
  selector: 'owl-novel-sidebar',
  imports: [CommonModule],
  templateUrl: './novel-sidebar.component.html',
  styleUrl: './novel-sidebar.component.scss',
})
export class NovelSidebarComponent {
  novel = input.required<NovelViewModel>();
}
