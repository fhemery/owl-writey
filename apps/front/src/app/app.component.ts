import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ConfigService } from '@owl/front/infra';
import { OwlWriteyUiComponent } from '@owl/ui';

import { environment } from '../environments/environment';

@Component({
  imports: [OwlWriteyUiComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Owl-Writey';
  readonly #config = inject(ConfigService);

  constructor() {
    this.#config.init(environment);
  }
}
