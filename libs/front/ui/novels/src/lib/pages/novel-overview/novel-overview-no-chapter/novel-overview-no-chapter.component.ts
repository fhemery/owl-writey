
import { Component, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'owl-novel-overview-no-chapter',
  imports: [MatButton, MatIcon, TranslateModule],
  templateUrl: './novel-overview-no-chapter.component.html',
  styleUrl: './novel-overview-no-chapter.component.scss',
})
export class NovelOverviewNoChapterComponent {
  add = output<void>();
  addChapter(): void {
    this.add.emit();
  }
}
