import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvironmentService } from '@owl/front/infra';
import { OwlWriteyUiComponent } from '@owl/ui';

import { environment } from '../environments/environment';

@Component({
  imports: [OwlWriteyUiComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'front-electron';
  readonly #env = inject(EnvironmentService);

  constructor() {
    this.#env.init(environment);
  }
}
