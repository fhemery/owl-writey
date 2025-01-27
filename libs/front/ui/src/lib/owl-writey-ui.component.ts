import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslationHubService } from '@owl/front/infra';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { uiFr } from './translations/fr';

@Component({
  selector: 'owl-writey-ui',
  imports: [CommonModule, HeaderComponent, RouterOutlet, FooterComponent],
  templateUrl: './owl-writey-ui.component.html',
  styleUrl: './owl-writey-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlWriteyUiComponent implements OnInit {
  private readonly translateHubService = inject(TranslationHubService);

  ngOnInit(): void {
    this.translateHubService.init(navigator?.languages || [], ['fr'], 'fr');

    this.translateHubService.loadTranslations('fr', uiFr);
  }
}
