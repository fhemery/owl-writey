import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '@owl/front/ui/common';

import {
  NovelFormComponent,
  NovelFormData,
} from '../../components/novel-form/novel-form.component';
import { NovelGeneralInfoViewModel } from '../../model';
import { NovelStore } from '../../services/novel.store';
import { NovelDeleteConfirmComponent } from './components/novel-delete-confirm/novel-delete-confirm.component';

@Component({
  selector: 'owl-novel-edit',
  imports: [CommonModule, NovelFormComponent],
  templateUrl: './novel-edit.component.html',
  styleUrl: './novel-edit.component.scss',
})
export class NovelEditComponent {
  readonly dialog = inject(MatDialog);
  readonly store = inject(NovelStore);
  readonly notificationService = inject(NotificationService);

  novel = this.store.novel;

  async update($event: NovelFormData): Promise<void> {
    const result = await this.store.updateGeneralInfo(
      new NovelGeneralInfoViewModel($event.title, $event.description)
    );
    if (!result) {
      this.notificationService.showError('novel.edit.result.ko');
    } else {
      this.notificationService.showSuccess('novel.edit.result.ok');
    }
  }

  deleteNovel(): void {
    this.dialog.open(NovelDeleteConfirmComponent, {});
  }
}
