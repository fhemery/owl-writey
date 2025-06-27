
import { Component, Input, OnDestroy, OnInit, signal } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'owl-fullscreen-menu',
  templateUrl: './fullscreen-menu.component.html',
  styleUrls: ['./fullscreen-menu.component.scss'],
  standalone: true,
  imports: [MatIcon, TranslateModule],
})
export class FullscreenMenuComponent implements OnInit, OnDestroy {
  @Input() editor!: Editor;
  isFullscreen = signal(false);

  private fullscreenChangeHandler: () => void;

  constructor() {
    // Create bound handler for fullscreenchange event
    this.fullscreenChangeHandler = this.handleFullscreenChange.bind(this);
  }

  ngOnInit(): void {
    // Add event listeners for fullscreen change events (for all browsers)
    document.addEventListener('fullscreenchange', this.fullscreenChangeHandler);
    document.addEventListener(
      'webkitfullscreenchange',
      this.fullscreenChangeHandler
    );
    document.addEventListener(
      'mozfullscreenchange',
      this.fullscreenChangeHandler
    );
    document.addEventListener(
      'MSFullscreenChange',
      this.fullscreenChangeHandler
    );
  }

  ngOnDestroy(): void {
    // Remove event listeners when component is destroyed
    document.removeEventListener(
      'fullscreenchange',
      this.fullscreenChangeHandler
    );
    document.removeEventListener(
      'webkitfullscreenchange',
      this.fullscreenChangeHandler
    );
    document.removeEventListener(
      'mozfullscreenchange',
      this.fullscreenChangeHandler
    );
    document.removeEventListener(
      'MSFullscreenChange',
      this.fullscreenChangeHandler
    );
  }

  toggleFullscreen(e: MouseEvent): void {
    e.preventDefault();
    const newState = !this.isFullscreen();
    this.isFullscreen.set(newState);

    if (newState) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  private enterFullscreen(): void {
    const editorElement = this.getEditorElement();
    if (editorElement && !document.fullscreenElement) {
      if (editorElement.requestFullscreen) {
        void editorElement
          .requestFullscreen()
          .catch((err: Error) =>
            console.error('Error attempting to enable fullscreen:', err)
          );
      } else if ('webkitRequestFullscreen' in editorElement) {
        void (
          editorElement as HTMLElement & {
            webkitRequestFullscreen(): Promise<void>;
          }
        ).webkitRequestFullscreen();
      } else if ('msRequestFullscreen' in editorElement) {
        void (
          editorElement as HTMLElement & {
            msRequestFullscreen(): Promise<void>;
          }
        ).msRequestFullscreen();
      }
    }

    // Add fullscreen class to the editor wrapper
    this.getEditorElement()?.classList.add('text-editor--fullscreen');

    // Focus the editor after entering fullscreen
    setTimeout(() => {
      this.editor.commands.focus().exec();
    }, 100);
  }

  private exitFullscreen(): void {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        void document
          .exitFullscreen()
          .catch((err: Error) =>
            console.error('Error attempting to exit fullscreen:', err)
          );
      } else if ('webkitExitFullscreen' in document) {
        void (
          document as Document & { webkitExitFullscreen(): Promise<void> }
        ).webkitExitFullscreen();
      } else if ('msExitFullscreen' in document) {
        void (
          document as Document & { msExitFullscreen(): Promise<void> }
        ).msExitFullscreen();
      }
    }

    // Remove fullscreen class from the editor wrapper
    this.getEditorElement()?.classList.remove('text-editor--fullscreen');
  }

  private getEditorElement(): HTMLElement | null {
    if (!this.editor) {
      return null;
    }

    // Get the editor DOM element directly from the editor instance
    if (this.editor.view && this.editor.view.dom) {
      // Find the closest wrapper element
      let element = this.editor.view.dom;
      while (element && !element.classList.contains('text-editor')) {
        if (element.parentElement) {
          element = element.parentElement;
        } else {
          break;
        }
      }

      // If we found the wrapper, return it
      if (element && element.classList.contains('text-editor')) {
        return element;
      }
    }

    return null;
  }

  /**
   * Handle fullscreen change events from the browser
   * This ensures our component state stays in sync when Escape key is pressed
   */
  private handleFullscreenChange(): void {
    // If browser is not in fullscreen mode but our component thinks it is,
    // update our state and remove the fullscreen class
    if (!document.fullscreenElement && this.isFullscreen()) {
      this.isFullscreen.set(false);
      this.getEditorElement()?.classList.remove('text-editor--fullscreen');
    }
  }
}
