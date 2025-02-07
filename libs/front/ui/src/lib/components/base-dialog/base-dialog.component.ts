import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'owl-base-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIcon, MatIconButton],
  templateUrl: './base-dialog.component.html',
  styleUrl: './base-dialog.component.scss',
})
export class BaseDialogComponent {
  close = output<void>();

  closeDialog(): void {
    this.close.emit();
  }
}
