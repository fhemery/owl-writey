import { Pipe, PipeTransform } from '@angular/core';
import { inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  readonly sanitizer = inject(DomSanitizer);

  transform(value: string): SafeHtml {
    if (!value) return '';

    // Create a whitelist of allowed tags and attributes
    const allowedTags = [
      'p',
      'span',
      'div',
      'br',
      'strong',
      'blockquote',
      'hr',
      'em',
      'i',
      'b',
      'u',
      's',
    ];
    const allowedAttributes: Record<string, string[]> = {
      span: ['style', 'class'],
      p: ['style', 'class'],
    };

    // Create a DOM parser to parse the HTML
    const doc = new DOMParser().parseFromString(value, 'text/html');

    // Remove any disallowed elements
    const elements = doc.body.getElementsByTagName('*');
    for (let i = elements.length - 1; i >= 0; i--) {
      const element = elements[i];

      // Remove disallowed tags
      if (!allowedTags.includes(element.tagName.toLowerCase())) {
        element.parentNode?.removeChild(element);
        continue;
      }

      // Remove disallowed attributes
      const allowedAttrs =
        allowedAttributes[element.tagName.toLowerCase()] || [];
      for (let j = element.attributes.length - 1; j >= 0; j--) {
        const attr = element.attributes[j];
        if (!allowedAttrs.includes(attr.name.toLowerCase())) {
          element.removeAttribute(attr.name);
        }
      }

      // Sanitize style attributes
      if (element.hasAttribute('style')) {
        const style = element.getAttribute('style') || '';
        // Only allow certain CSS properties
        const allowedProperties = [
          'color',
          'text-align',
          'font-weight',
          'font-style',
          'text-decoration',
        ];
        const sanitizedStyle = style
          .split(';')
          .filter((declaration) => {
            const [prop] = declaration.split(':');
            return (
              prop && allowedProperties.includes(prop.trim().toLowerCase())
            );
          })
          .join(';');

        if (sanitizedStyle) {
          element.setAttribute('style', sanitizedStyle);
        } else {
          element.removeAttribute('style');
        }
      }
    }

    // Sanitize the resulting HTML
    const sanitizedHtml = doc.body.innerHTML;
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml);
  }
}
