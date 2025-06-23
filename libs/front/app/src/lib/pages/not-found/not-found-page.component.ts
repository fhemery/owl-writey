
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE } from '@owl/front/auth';

@Component({
  selector: 'owl-not-found-page',
  imports: [TranslateModule, MatIcon, MatButton, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  readonly #auth = inject(AUTH_SERVICE);
  user = this.#auth.user;
}
