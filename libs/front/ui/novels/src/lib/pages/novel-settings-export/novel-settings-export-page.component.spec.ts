import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';
import { Novel } from '@owl/shared/novels/model';

import { NovelStore } from '../../services/novel.store';
import { NovelSettingsExportPageComponent } from './novel-settings-export-page.component';

describe('NovelSettingsExportPageComponent', () => {
  let component: NovelSettingsExportPageComponent;
  let fixture: ComponentFixture<NovelSettingsExportPageComponent>;
  let testUtils: TestUtils;
  let novel: WritableSignal<Novel | null>;

  beforeEach(async () => {
    novel = signal(null);
    await TestBed.configureTestingModule({
      imports: [
        NovelSettingsExportPageComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [{ provide: NovelStore, useValue: { novel } }],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelSettingsExportPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a checkbox field and a separator text field', () => {
    expect(
      testUtils.hasElement('input[formControlName="separator"]')
    ).toBeTruthy();
    expect(testUtils.hasElement('mat-checkbox')).toBeTruthy();
  });
});
