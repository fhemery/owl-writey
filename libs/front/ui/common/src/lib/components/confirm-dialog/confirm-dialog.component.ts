
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { BaseDialogComponent } from '../base-dialog/base-dialog.component';

@Component({
  selector: 'owl-confirm-dialog',
  standalone: true,
  imports: [TranslateModule, MatButton, BaseDialogComponent],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  confirm = output<boolean>();
  title = input.required<string>();
  confirmLabel = input.required<string>();
  cancelLabel = input.required<string>();
  confirmEnabled = input(true);

  closeDialog(): void {
    this.confirm.emit(false);
  }

  doConfirm(): void {
    this.confirm.emit(true);
  }
}
