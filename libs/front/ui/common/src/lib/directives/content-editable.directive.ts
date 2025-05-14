import {
  computed,
  Directive,
  ElementRef,
  HostListener,
  input,
  OnInit,
  output,
  Renderer2,
  signal,
} from '@angular/core';

@Directive({
  selector: '[owlContentEditable]',
  standalone: true,
})
export class ContenteditableDirective implements OnInit {
  contentChange = output<string>();
  multiLine = input<boolean>(false);
  isEditing = signal<boolean>(false);

  focusOnEnter = input<boolean | undefined>(undefined);
  private shouldFocusOnEnter = computed(() => this.focusOnEnter() ?? !this.multiLine());

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
    this.isEditing.set(false);
  }

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    event.preventDefault();
    
    if (this.shouldFocusOnEnter() && !this.isEditing()) {
      this.selectContent();
      this.isEditing.set(true);
    }
  }

  private selectContent(): void {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(this.elementRef.nativeElement);
    selection?.removeAllRanges();
    selection?.addRange(range);
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
