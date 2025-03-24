import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInput } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ConfigService } from '@owl/front/infra';
import { BaseDialogComponent } from '@owl/front/ui/common';

import { NotificationService } from '../../../../services/notification.service';

@Component({
  selector: 'owl-exercise-share-dialog',
  imports: [
    CommonModule,
    BaseDialogComponent,
    MatButton,
    MatFormField,
    MatInput,
    TranslateModule,
  ],
  templateUrl: './exercise-share-dialog.component.html',
  styleUrl: './exercise-share-dialog.component.scss',
})
export class ExerciseShareDialogComponent {
  readonly #matDialog = inject(MatDialogRef);
  readonly #notificator = inject(NotificationService);
  readonly matDialogData = inject(MAT_DIALOG_DATA);
  readonly translateService = inject(TranslateService);
  readonly config = inject(ConfigService).environment();

  readonly exerciseId = this.matDialogData.id;

  close(): void {
    this.#matDialog.close();
  }
  getLink(): string {
    return `${this.config.baseUrl}/exercises/${this.exerciseId}/participate`;
  }
  async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.getLink());
    this.#notificator.showSuccess(
      this.translateService.instant('exercise.share.link.copied')
    );
  }
}
