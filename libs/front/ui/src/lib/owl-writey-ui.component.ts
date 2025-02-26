import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  TranslationHubService,
  UserNotificationsService,
} from '@owl/front/infra';
import { SseEvent } from '@owl/shared/contracts';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationService } from './services/notification.service';
import { uiFr } from './translations/fr';

@Component({
  selector: 'owl-writey-ui',
  imports: [CommonModule, HeaderComponent, RouterOutlet, FooterComponent],
  providers: [UserNotificationsService],
  templateUrl: './owl-writey-ui.component.html',
  styleUrl: './owl-writey-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlWriteyUiComponent implements OnInit {
  private readonly translateHubService = inject(TranslationHubService);
  // TODO : create a service that manages everything
  private readonly notificationService = inject(UserNotificationsService);
  private readonly toastsService = inject(NotificationService);
  private readonly translateService = inject(TranslateService);

  ngOnInit(): void {
    this.translateHubService.init(navigator?.languages || [], ['fr'], 'fr');

    this.translateHubService.loadTranslations('fr', uiFr);

    this.notificationService.connect().subscribe((event: SseEvent) => {
      this.toastsService.showInfo(
        this.translateService.instant(
          `events.${event.event}`,
          event.data as Record<string, string>
        )
      );
    });
  }
}
