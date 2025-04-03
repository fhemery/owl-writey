import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { NovelViewModel } from '../../../../../../model';

@Component({
  selector: 'owl-novel-sidebar-universe',
  imports: [CommonModule, MatIcon, TranslateModule, RouterLink],
  templateUrl: './novel-sidebar-universe.component.html',
  styleUrl: './novel-sidebar-universe.component.scss',
})
export class NovelSidebarUniverseComponent {
  readonly novel = input.required<NovelViewModel>();
}
