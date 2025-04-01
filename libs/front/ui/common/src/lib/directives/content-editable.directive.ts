// contenteditable.directive.ts
import {
  Directive,
  ElementRef,
  HostListener,
  OnInit,
  output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[owlContentEditable]',
  standalone: true,
})
export class ContenteditableDirective implements OnInit {
  contentChange = output<string>();

  constructor(private elementRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    // Set the element as contenteditable
    this.renderer.setAttribute(
      this.elementRef.nativeElement,
      'contenteditable',
      'true'
    );
  }

  @HostListener('blur')
  onBlur(): void {
    const content = this.elementRef.nativeElement.innerHTML;
    this.contentChange.emit(content);
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.elementRef.nativeElement.blur();
  }
}
