import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { OwlWriteyUiComponent } from '@owl/front/ui';

@Component({
  imports: [OwlWriteyUiComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Owl-Writey';
  private readonly router = inject(Router);

  constructor() {
    this.router.initialNavigation();
  }
}
