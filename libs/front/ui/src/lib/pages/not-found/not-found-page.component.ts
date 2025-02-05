import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FirebaseAuthService } from '@owl/front/auth';

@Component({
  selector: 'owl-not-found-page',
  imports: [CommonModule, TranslateModule, MatIcon, MatButton, RouterLink],
  templateUrl: './not-found-page.component.html',
  styleUrl: './not-found-page.component.scss',
})
export class NotFoundPageComponent {
  readonly #auth = inject(FirebaseAuthService);
  user = this.#auth.user;
}
