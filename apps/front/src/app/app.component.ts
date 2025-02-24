import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OwlWriteyUiComponent } from '@owl/ui';

@Component({
  imports: [OwlWriteyUiComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Owl-Writey';
}
