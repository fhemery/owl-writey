import { TranslateService } from '@ngx-translate/core';

export function generateEditorLocaleButtons(
  translateService: TranslateService
): Record<string, string> {
  return {
    bold: translateService.instant('textEditor.buttons.bold'),
    italic: translateService.instant('textEditor.buttons.italic'),
    underline: translateService.instant('textEditor.buttons.underline'),
    strike: translateService.instant('textEditor.buttons.strike'),
    blockquote: translateService.instant('textEditor.buttons.blockquote'),
    align_left: translateService.instant('textEditor.buttons.alignLeft'),
    align_center: translateService.instant('textEditor.buttons.alignCenter'),
    align_right: translateService.instant('textEditor.buttons.alignRight'),
    align_justify: translateService.instant('textEditor.buttons.alignJustify'),
    text_color: translateService.instant('textEditor.buttons.textColor'),
    horizontal_rule: translateService.instant(
      'textEditor.buttons.horizontalRule'
    ),
  };
}
