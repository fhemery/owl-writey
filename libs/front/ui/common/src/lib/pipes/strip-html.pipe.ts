import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'stripHtml',
  standalone: true,
})
export class StripHtmlPipe implements PipeTransform {
  readonly sanitizer = inject(DomSanitizer);

  transform(value: string): string {
    if (!value) return '';

    let newValue = value
      .replace(/<div>/g, '\n')
      .replace(/<\/div>/g, '')
      .replace(/<br\/?>/g, '\n')
      .replace(/&[a-z]+;/g, '')
      .replace(/<[^>]*>/g, '');

    if (newValue.startsWith('\n')) {
      newValue = newValue.substring(1);
    }
    return newValue;
  }
}
