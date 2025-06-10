import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovelSettingsExportPageComponent } from './novel-settings-export-page.component';

describe('NovelSettingsExportPageComponent', () => {
  let component: NovelSettingsExportPageComponent;
  let fixture: ComponentFixture<NovelSettingsExportPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelSettingsExportPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelSettingsExportPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
