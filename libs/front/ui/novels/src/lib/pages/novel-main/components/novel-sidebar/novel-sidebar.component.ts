import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelViewModel } from '../../../../model';

@Component({
  selector: 'owl-novel-sidebar',
  imports: [CommonModule, TranslateModule, MatIcon, RouterLink],
  templateUrl: './novel-sidebar.component.html',
  styleUrl: './novel-sidebar.component.scss',
})
export class NovelSidebarComponent {
  novel = input.required<NovelViewModel>();
}
