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
    });
  }

  public showError(message: string): void {
    this.#snackbar.open(message, this.#translateService.instant('general.ok'), {
      panelClass: 'snack-error',
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

  private showSnackbar(
    message: string,
    action: string,
    panelClass: string
  ): void {
    this.#snackbar.open(message, action, {
      panelClass,
    });
  }
}
