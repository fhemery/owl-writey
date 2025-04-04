import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ConfirmDialogComponent,
  NotificationService,
} from '@owl/front/ui/common';

import { NovelStore } from '../../../../services/novel.store';

@Component({
  selector: 'owl-novel-delete-confirm',
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatLabel,
    MatFormField,
    MatInput,
    ConfirmDialogComponent,
  ],
  templateUrl: './novel-delete-confirm.component.html',
  styleUrl: './novel-delete-confirm.component.scss',
})
export class NovelDeleteConfirmComponent {
  readonly dialog = inject(MatDialogRef);
  readonly store = inject(NovelStore);
  readonly router = inject(Router);
  readonly notificationService = inject(NotificationService);
  readonly novel = this.store.novel;

  novelName = '';

  async delete(isDeletionConfirmed: boolean): Promise<void> {
    if (isDeletionConfirmed) {
      const result = await this.store.deleteNovel();
      if (result) {
        this.notificationService.showSuccess('novel.delete.result.ok');
        await this.router.navigate(['/dashboard']);
      } else {
        this.notificationService.showError('novel.delete.result.error');
      }
    }
    this.dialog.close();
  }
}
