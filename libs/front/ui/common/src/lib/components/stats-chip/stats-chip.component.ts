import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'owl-stats-chip',
  imports: [CommonModule, MatIcon, MatTooltip],
  templateUrl: './stats-chip.component.html',
  styleUrl: './stats-chip.component.scss',
})
export class StatsChipComponent {
  icon = input.required<string>();
  title = input.required<string>();
  value = input.required<string | number>();

  isOutlined = computed(() => this.icon() === 'format_paragraph');
}
