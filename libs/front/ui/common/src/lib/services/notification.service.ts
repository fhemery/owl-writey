import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  readonly #snackbar = inject(MatSnackBar);
  readonly #translateService = inject(TranslateService);

  showError(key: string, data?: Record<string, string>): void {
    this.showErrorSnackbar(this.#translateService.instant(key, data));
  }
  showSuccess(key: string, data?: Record<string, unknown>): void {
    this.showSuccessSnackbar(this.#translateService.instant(key, data));
  }
  showInfo(key: string, data?: Record<string, unknown>): void {
    this.showInfoSnackbar(this.#translateService.instant(key, data));
  }

  notifyEvent(eventName: string, data: Record<string, unknown>): void {
    this.showInfoSnackbar(
      this.#translateService.instant(`events.${eventName}`, data)
    );
  }

  private showSuccessSnackbar(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-success',
      duration: 5000,
    });
  }

  private showErrorSnackbar(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-error',
      duration: 5000,
    });
  }

  private showInfoSnackbar(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-info',
      duration: 5000,
      horizontalPosition: 'end',
      verticalPosition: 'bottom',
    });
  }
}
