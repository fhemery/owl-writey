import { Component, inject, Injectable } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ConfirmDialogService {
  readonly #dialog = inject(MatDialog);

  /**
   * Opens a confirmation dialog with the specified title and text
   * @param titleKey Translation key for the dialog title
   * @param textKey Translation key for the dialog content text
   * @param confirmButtonKey Optional translation key for the confirm button (defaults to 'general.yes')
   * @param cancelButtonKey Optional translation key for the cancel button (defaults to 'general.no')
   * @returns A Promise that resolves to true if the user confirms, false otherwise
   */
  async openConfirmDialog(
    titleKey: string,
    textKey: string,
    confirmButtonKey = 'general.yes',
    cancelButtonKey = 'general.no'
  ): Promise<boolean> {
    return firstValueFrom(
      this.#dialog
        .open(InternalConfirmDialogComponent, {
          data: {
            titleKey,
            messageKey: textKey,
            confirmButtonKey,
            cancelButtonKey,
          },
        })
        .afterClosed()
    );
  }
}

@Component({
  selector: 'owl-internal-confirm-dialog',
  standalone: true,
  imports: [ConfirmDialogComponent, TranslateModule],
  template: `<owl-confirm-dialog
    [title]="data.titleKey | translate"
    [confirmLabel]="data.confirmButtonKey | translate"
    [cancelLabel]="data.cancelButtonKey | translate"
    (confirm)="confirmDeletion($event)"
  >
    <p>{{ data.messageKey | translate }}</p>
  </owl-confirm-dialog>`,
})
class InternalConfirmDialogComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  readonly #matDialogRef = inject(MatDialogRef);

  confirmDeletion(event: boolean): void {
    this.#matDialogRef.close(event);
  }
}
