import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import {
  TranslationHubService,
  UserNotificationsService,
} from '@owl/front/infra';
import { SseEvent } from '@owl/shared/contracts';
import { uiFr } from '@owl/shared/translations';
import { Subscription } from 'rxjs';

import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { NotificationService } from './services/notification.service';

@Component({
  selector: 'owl-writey-ui',
  imports: [CommonModule, HeaderComponent, RouterOutlet, FooterComponent],
  providers: [UserNotificationsService],
  templateUrl: './owl-writey-ui.component.html',
  styleUrl: './owl-writey-ui.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwlWriteyUiComponent implements OnInit, OnDestroy {
  private readonly translateHubService = inject(TranslationHubService);
  // TODO : create a service that manages everything
  private readonly notificationService = inject(UserNotificationsService);
  private readonly toastsService = inject(NotificationService);
  private readonly translateService = inject(TranslateService);
  private subscription?: Subscription;

  ngOnInit(): void {
    this.translateHubService.init(navigator?.languages || [], ['fr'], 'fr');

    this.translateHubService.loadTranslations('fr', uiFr);

    this.subscription = this.notificationService
      .connectUser()
      .subscribe((event: SseEvent) => {
        this.toastsService.showInfo(
          this.translateService.instant(
            `events.${event.event}`,
            event.data as Record<string, string>
          )
        );
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
