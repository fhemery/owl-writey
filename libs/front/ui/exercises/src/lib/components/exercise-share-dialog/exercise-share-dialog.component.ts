
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatInput } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigService } from '@owl/front/infra';
import { BaseDialogComponent, NotificationService } from '@owl/front/ui/common';

@Component({
  selector: 'owl-exercise-share-dialog',
  imports: [
    BaseDialogComponent,
    MatButton,
    MatFormField,
    MatInput,
    TranslateModule
],
  templateUrl: './exercise-share-dialog.component.html',
  styleUrl: './exercise-share-dialog.component.scss',
})
export class ExerciseShareDialogComponent {
  readonly #matDialog = inject(MatDialogRef);
  readonly #notificator = inject(NotificationService);
  readonly matDialogData = inject(MAT_DIALOG_DATA);
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
    this.#notificator.showSuccess('exercise.share.link.copied');
  }
}
