import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';

import { NovelService } from '../../services/novel.service';
import { NovelCreatePageComponent } from './novel-create-page.component';

describe('NovelCreatePageComponent', () => {
  let component: NovelCreatePageComponent;
  let fixture: ComponentFixture<NovelCreatePageComponent>;
  let novelService: Partial<NovelService>;
  let routerSpy: Partial<Router>;
  let testUtils: TestUtils;

  beforeEach(() => {
    novelService = {
      createNovel: vi.fn().mockResolvedValue('123'),
    } as Partial<NovelService>;
    routerSpy = {
      navigate: vi.fn().mockResolvedValue(true),
    } as Partial<Router>;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NovelCreatePageComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: NovelService, useValue: novelService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NovelCreatePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testUtils = new TestUtils(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasText('novel.createPage.title', 'h1')).toBeTruthy();
  });

  it('should display the expected fields', () => {
    expect(testUtils.hasElement('input[formControlName="title"]')).toBeTruthy();
    expect(testUtils.hasElement('owl-text-editor')).toBeTruthy();
    expect(testUtils.hasElement('button[type="submit"]')).toBeTruthy();
  });

  describe('success cases', () => {
    it('should enable button if title is filled', () => {
      testUtils.updateInputField('input[name="title"]', 'test');
      expect(
        testUtils.getElementAt('button[type="submit"]').getAttribute('disabled')
      ).toBeFalsy();
    });

    it('should call the novelService with the correct data', async () => {
      testUtils.updateInputField('input[name="title"]', 'test');
      await testUtils.submitReactiveForm('#novelForm');
      expect(novelService.createNovel).toHaveBeenCalledWith({
        title: 'test',
        description: '',
      });
    });

    it('should call the router to redirect', async () => {
      testUtils.updateInputField('input[name="title"]', 'test');
      await testUtils.submitReactiveForm('#novelForm');
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/novels', '123']);
    });
  });

  describe('errors', () => {
    it('should display an error when title is set to empty', () => {
      testUtils.updateInputField('input[name="title"]', '');
      fixture.detectChanges();

      expect(
        testUtils.getElementAt('button[type="submit"]').getAttribute('disabled')
      ).toBeTruthy();

      expect(testUtils.hasElement('mat-error')).toBeTruthy();
      expect(
        testUtils.hasText('novel.form.title.error.required', 'mat-error')
      ).toBeTruthy();
    });

    it('should display an error when title is too short', () => {
      testUtils.updateInputField('input[name="title"]', 'a');
      fixture.detectChanges();

      expect(
        testUtils.getElementAt('button[type="submit"]').getAttribute('disabled')
      ).toBeTruthy();

      expect(testUtils.hasElement('mat-error')).toBeTruthy();
      expect(
        testUtils.hasText('novel.form.title.error.minlength', 'mat-error')
      ).toBeTruthy();
    });
  });
});
