
import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Novel } from '@owl/shared/novels/model';

@Component({
  selector: 'owl-novel-sidebar-universe',
  imports: [MatIcon, TranslateModule, RouterLink],
  templateUrl: './novel-sidebar-universe.component.html',
  styleUrl: './novel-sidebar-universe.component.scss',
})
export class NovelSidebarUniverseComponent {
  readonly novel = input.required<Novel>();
}
