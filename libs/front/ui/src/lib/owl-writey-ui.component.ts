import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { TranslationHubService } from '@owl/front/infra';
import { uiFr } from './translations/fr';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from './components/footer/footer.component';

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
