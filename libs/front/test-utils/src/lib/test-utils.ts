import { InputSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslationKey } from '@owl/shared/common/translations';

export class TestUtils {
  constructor(private readonly fixture: ComponentFixture<unknown>) {}

  updateInputField(fieldSelector: string, value: string): void {
    const input: HTMLInputElement | null =
      this.fixture.nativeElement.querySelector(fieldSelector);
    if (!input) {
      throw new Error(`Element not found: ${fieldSelector}`);
    }
    input.value = value;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    this.fixture.detectChanges();
  }

  getInputValue(selector: string): string {
    const input: HTMLInputElement | null =
      this.fixture.nativeElement.querySelector(selector);
    if (!input) {
      throw new Error(`Element not found: ${selector}`);
    }
    return input.value;
  }

  hasElement(selector: string): boolean {
    return !!this.fixture.nativeElement.querySelector(selector);
  }

  getElementAt(selector: string, index = 0): HTMLElement {
    const element =
      this.fixture.nativeElement.querySelectorAll(selector)[index];
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element as HTMLElement;
  }

  getDocumentElementAt(selector: string, index = 0): HTMLElement {
    const element = document.querySelectorAll(selector)[index];
    if (!element) {
      throw new Error(`Element not found: ${selector}`);
    }
    return element as HTMLElement;
  }

  getTextForElementAt(selector: string, index = 0): string {
    const element = this.getElementAt(selector, index);
    return element.textContent?.trim() || '';
  }

  clickElementAt(selector: string, index = 0): void {
    const element = this.getElementAt(selector, index);
    element.dispatchEvent(new Event('click'));
    this.fixture.detectChanges();
  }

  clickDocumentElement(selector: string, index = 0): void {
    const element = this.getDocumentElementAt(selector, index);
    element.dispatchEvent(new Event('click'));
    this.fixture.detectChanges();
  }

  getNbElements(selector: string): number {
    return this.fixture.nativeElement.querySelectorAll(selector).length;
  }

  getTextForDocumentElementAt(selector: string, index = 0): string {
    return this.getDocumentElementAt(selector, index).textContent?.trim() || '';
  }

  dispatchEvent(
    eventToDispatch: string,
    selector: string,
    index = 0,
    eventData: unknown = {}
  ): void {
    const element = this.fixture.debugElement.queryAll(By.css(selector))[index];
    element.triggerEventHandler(eventToDispatch, eventData);
    this.fixture.detectChanges();
  }

  hasActiveToggle(selector: string): boolean {
    return this.getElementAt(selector).className.includes(
      'mat-mdc-slide-toggle-checked'
    );
  }

  hoverAt(selector: string, index = 0): void {
    this.dispatchEvent('mouseover', selector, index, {
      stopPropagation: () => {
        return;
      },
    });
  }

  setInput<T>(
    fieldName: () => InputSignal<T>,
    value: T,
    doDetectChanges = false
  ): void {
    const variableName = this.getVariableName(fieldName);
    this.fixture.componentRef.setInput(variableName, value);
    if (doDetectChanges) {
      this.fixture.detectChanges();
    }
  }

  private getVariableName(getVar: () => unknown): string {
    const extractor = new RegExp('(.*)');
    const m = extractor.exec(getVar + '');

    if (m == null)
      throw new Error(
        "The function does not contain a statement matching 'return variableName;'"
      );

    const fullMemberName = m[1];
    const memberParts = fullMemberName.split('.');

    return memberParts[memberParts.length - 1];
  }

  submitReactiveForm(selector: string): void {
    this.dispatchEvent('submit', selector);
  }

  getDocumentNbElements(selector: string): number {
    return document.querySelectorAll(selector).length;
  }

  hasText(expectedText: TranslationKey, selector: string): boolean {
    return this.getTextForElementAt(selector).includes(expectedText);
  }
}
