import { Component, input, output } from '@angular/core';

@Component({
  selector: 'owl-base-right-pane-component',
  template: '',
  standalone: true,
})
export class BaseRightPaneComponent<TInput> {
  data = input.required<TInput>();

  doClose = output<void>();
}
