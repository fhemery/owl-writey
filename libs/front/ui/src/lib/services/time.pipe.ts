import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { interval, map, Observable } from 'rxjs';

@Pipe({
  name: 'timeDiff',
})
export class TimeDiffPipe implements PipeTransform {
  readonly #translate = inject(TranslateService);

  transform(value?: string): Observable<string> {
    return interval(1000).pipe(map(() => this.calculateDiff(value)));
  }

  private calculateDiff(value?: string): string {
    if (value) {
      let seconds = Math.ceil((+new Date(value) - +new Date()) / 1000); // expiry Date - current time

      const sign = Math.sign(seconds);
      seconds *= sign;

      let counter = '';
      for (const intervals of allIntervals) {
        if (seconds < intervals.nbSeconds) {
          continue;
        }
        const nb = Math.floor(seconds / intervals.nbSeconds);
        const unit = this.#translate.instant(
          'general.time.units.' +
            intervals.unit +
            (nb === 1 ? '.singular' : '.plural')
        );
        counter += ' ' + nb + ' ' + unit;

        seconds = seconds % intervals.nbSeconds;
      }
      if (sign === -1) {
        return this.#translate.instant('general.time.ago', {
          time: counter.trim(),
        });
      }
      return this.#translate.instant('general.time.left', {
        time: counter.trim(),
      });
    }
    return '';
  }
}

const allIntervals: { unit: string; nbSeconds: number }[] = [
  { unit: 'year', nbSeconds: 31536000 },
  { unit: 'month', nbSeconds: 2592000 },
  { unit: 'week', nbSeconds: 604800 },
  { unit: 'day', nbSeconds: 86400 },
  { unit: 'hour', nbSeconds: 3600 },
  { unit: 'minute', nbSeconds: 60 },
  { unit: 'second', nbSeconds: 1 },
];
