
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  Signal,
  signal,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { RightPanelService } from './services/right-panel.service';

@Component({
  selector: 'owl-right-pane',
  imports: [TranslateModule],
  templateUrl: './right-panel.component.html',
  styleUrl: './right-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RightPanelComponent {
  private readonly rightPaneService = inject(RightPanelService);

  hasComponent = signal(false);

  container: Signal<ViewContainerRef> = viewChild.required('container', {
    read: ViewContainerRef,
  });

  constructor() {
    effect(() => {
      const componentData = this.rightPaneService.currentComponent();
      this.container().clear();
      if (componentData) {
        const component = this.container().createComponent(
          componentData.component
        );
        component.setInput('data', componentData.data);
        component.instance.doClose.subscribe(() => {
          this.close();
        });
        this.hasComponent.set(true);
      } else {
        this.hasComponent.set(false);
      }
    });
  }

  close(): void {
    this.rightPaneService.clearComponent();
    this.hasComponent.set(false);
  }
}
