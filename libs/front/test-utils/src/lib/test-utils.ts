import { InputSignal } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TranslationKey } from '@owl/shared/common/translations';
import { Editor } from 'ngx-editor';

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

  isDisabled(selector: string): boolean {
    const button: HTMLButtonElement | null =
      this.fixture.nativeElement.querySelector(selector);
    if (!button) {
      throw new Error(`Element not found: ${selector}`);
    }
    return button.disabled;
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

  clickToggle(selector: string): void {
    this.clickElementAt(`${selector} button`);
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

  doubleClickElementAt(selector: string, index = 0): void {
    const element = this.getElementAt(selector, index);
    element.dispatchEvent(new Event('dblclick'));
    this.fixture.detectChanges();
  }

  getNbElements(selector: string): number {
    return this.fixture.nativeElement.querySelectorAll(selector).length;
  }

  getTextForDocumentElementAt(selector: string, index = 0): string {
    return this.getDocumentElementAt(selector, index).textContent?.trim() || '';
  }

  getValue(selector: string): string {
    const input: HTMLInputElement | null =
      this.fixture.nativeElement.querySelector(selector);
    if (!input) {
      throw new Error(`Element not found: ${selector}`);
    }
    return input.value;
  }

  hasSelectedValue(selectName: string, value: string): boolean {
    const select = this.fixture.nativeElement.querySelector(
      `mat-select[name=${selectName}] .mat-mdc-select-value`
    );
    if (!select) {
      throw new Error(`Element not found: ${selectName}`);
    }
    return select.innerHTML?.trim()?.includes(value);
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

  updateEditableField(fieldSelector: string, value: string): void {
    const input: HTMLInputElement | null =
      this.fixture.nativeElement.querySelector(fieldSelector);
    if (!input) {
      throw new Error(`Element not found: ${fieldSelector}`);
    }
    input.innerHTML = value;
    input.dispatchEvent(new Event('change'));
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('blur'));
    input.dispatchEvent(new Event('keyup'));
    this.fixture.detectChanges();
  }

  updateTextEditorContent(newContent: string, selector = ''): void {
    const editorUtils = new EditorUtils(this.fixture);
    editorUtils.typeText(selector, newContent);
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

  async waitStable(): Promise<void> {
    // This seems overkill, but if multiple promises are pending,
    // we need to wait for them all to resolve
    this.fixture.detectChanges();
    await this.fixture.whenStable();
    await this.fixture.whenStable();
    await this.fixture.whenStable();
    await this.fixture.whenStable();
    await this.fixture.whenStable();
    this.fixture.detectChanges();
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

  async submitReactiveForm(selector: string): Promise<void> {
    this.dispatchEvent('submit', selector);
    await this.waitStable();
  }

  getDocumentNbElements(selector: string): number {
    return document.querySelectorAll(selector).length;
  }

  hasText(expectedText: TranslationKey, selector: string, index = 0): boolean {
    return this.getTextForElementAt(selector, index).includes(expectedText);
  }

  printDebugInfo(): void {
    console.log(this.fixture.debugElement.nativeElement.innerHTML);
  }
}

class EditorUtils {
  constructor(private readonly fixture: ComponentFixture<unknown>) {}

  typeText(selector: string, text: string, clearCurrentContent = false): void {
    const editorComponent = this.fixture.debugElement.query(
      By.css(`${selector} ngx-editor`)
    ).componentInstance['editor'] as Editor;
    if (clearCurrentContent) {
      editorComponent.setContent('');
    }
    editorComponent.commands.focus('end').exec();
    let isFirstOperation = true;
    text.split(`\n`).forEach((text) => {
      if (isFirstOperation) {
        isFirstOperation = false;
      } else {
        editorComponent.commands.insertNewLine().exec();
      }
      editorComponent.commands.insertText(text).exec();
    });

    this.fixture.detectChanges();
  }
}
