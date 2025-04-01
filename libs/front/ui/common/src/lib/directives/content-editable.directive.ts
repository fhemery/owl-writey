import {
  Directive,
  ElementRef,
  HostListener,
  input,
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
  multiLine = input<boolean>(false);

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
    (this.elementRef.nativeElement as HTMLInputElement).scrollLeft = 0;
    (this.elementRef.nativeElement as HTMLInputElement).scrollTop = 0;
  }

  @HostListener('keydown.enter', ['$event'])
  onEnterKeydown(event: KeyboardEvent): void {
    if (!this.multiLine()) {
      event.preventDefault();
      this.elementRef.nativeElement.blur();
    }
  }

  @HostListener('keydown.shift.enter', ['$event'])
  onShiftEnterKeydown(event: KeyboardEvent): void {
    event.preventDefault();
    this.elementRef.nativeElement.blur();
  }
}
