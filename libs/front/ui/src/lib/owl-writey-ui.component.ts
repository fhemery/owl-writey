import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'owl-writey-ui',
  imports: [CommonModule],
  templateUrl: './owl-writey-ui.component.html',
  styleUrl: './owl-writey-ui.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlWriteyUiComponent {}
