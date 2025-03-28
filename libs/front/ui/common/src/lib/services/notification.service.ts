import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly #snackbar = inject(MatSnackBar);
  readonly #translateService = inject(TranslateService);

  public showSuccess(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-success',
      duration: 5000,
    });
  }

  public showError(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-error',
      duration: 5000,
    });
  }

  public showInfo(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-info',
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }

  showErrorTranslate(key: string, data?: Record<string, string>): void {
    this.showError(this.#translateService.instant(key, data));
  }
  showSuccessTranslate(key: string, data?: Record<string, unknown>): void {
    this.showSuccess(this.#translateService.instant(key, data));
  }

  notifyEvent(eventName: string, data: Record<string, unknown>): void {
    this.showInfo(this.#translateService.instant(`events.${eventName}`, data));
  }
}
