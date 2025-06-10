import { Type } from '@angular/core';

import { BaseRightPaneComponent } from '../components/base-right-pane.component';

export class RightPanelComponentDisplayRequest<TInput> {
  constructor(
    public component: Type<BaseRightPaneComponent<TInput>>,
    public data: TInput
  ) {}
}
