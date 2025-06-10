import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TestUtils } from '@owl/front/test-utils';

import { NovelSettingsPageComponent } from './novel-settings-page.component';

describe('NovelSettingsPageComponent', () => {
  let component: NovelSettingsPageComponent;
  let fixture: ComponentFixture<NovelSettingsPageComponent>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovelSettingsPageComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelSettingsPageComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('display', () => {
    it('should display the page', () => {
      expect(testUtils.hasElement('.novel-settings-page')).toBeTruthy();
    });
  });
});
