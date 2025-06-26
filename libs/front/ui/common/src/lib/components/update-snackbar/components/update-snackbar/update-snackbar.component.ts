import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

import { UpdateService } from '../../services/update.service';

@Component({
  selector: 'owl-update-snackbar',
  imports: [CommonModule, TranslateModule, MatButton],
  templateUrl: './update-snackbar.component.html',
  styleUrls: ['./update-snackbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateSnackbarComponent {
  private readonly updateService = inject(UpdateService);
  updateReady$ = this.updateService.updateReady$;
  isHiddenByUser = false;

  update(): void {
    window.location.reload();
  }

  hide(): void {
    this.isHiddenByUser = true;
  }
}
