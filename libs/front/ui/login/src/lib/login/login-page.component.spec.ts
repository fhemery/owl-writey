import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE, AuthService } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';

import { LoginPageComponent } from './login-page.component';

describe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let loginService: Partial<AuthService>;
  let testUtils: TestUtils;

  beforeEach(() => {
    loginService = {
      login: vi.fn().mockResolvedValue(true),
    } as Partial<AuthService>;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginPageComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AUTH_SERVICE, useValue: loginService },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    testUtils = new TestUtils(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasText('auth.title', 'h2')).toBeTruthy();
  });

  it('should display the expected fields', () => {
    expect(testUtils.hasElement('input[formControlName="login"]')).toBeTruthy();
    expect(
      testUtils.hasElement('input[formControlName="password"]')
    ).toBeTruthy();
    expect(testUtils.hasElement('button[type="submit"]')).toBeTruthy();
  });

  describe('success cases', () => {
    it('should enable button if login and password are filled', () => {
      testUtils.updateInputField('input[name="login"]', 'test@test.fr');
      testUtils.updateInputField('input[name="password"]', 'test');
      expect(
        testUtils.getElementAt('button[type="submit"]').getAttribute('disabled')
      ).toBeFalsy();
    });

    it('should call the authService with the correct data', async () => {
      testUtils.updateInputField('input[name="login"]', 'test@test.fr');
      testUtils.updateInputField('input[name="password"]', 'test');
      await testUtils.submitReactiveForm('#loginForm');
      expect(loginService.login).toHaveBeenCalledWith('test@test.fr', 'test');
    });
  });

  describe('errors', () => {
    it('should display an error when login is set to empty', () => {
      testUtils.updateInputField('input[name="login"]', '');
      fixture.detectChanges();

      expect(testUtils.hasElement('mat-error')).toBeTruthy();
      expect(
        testUtils.hasText('auth.form.email.error.required', 'mat-error')
      ).toBeTruthy();
    });

    it('should display an error when login is not an email', () => {
      testUtils.updateInputField('input[name="login"]', 'test');
      fixture.detectChanges();

      expect(testUtils.hasElement('mat-error')).toBeTruthy();
      expect(
        testUtils.hasText('auth.form.email.error.email', 'mat-error')
      ).toBeTruthy();
    });

    it('should display an error when password is set to empty', () => {
      testUtils.updateInputField('input[name="password"]', '');
      fixture.detectChanges();

      expect(
        testUtils.getElementAt('button[type="submit"]').getAttribute('disabled')
      ).toBeTruthy();

      expect(testUtils.hasElement('mat-error')).toBeTruthy();
      expect(
        testUtils.hasText('auth.form.password.error.required', 'mat-error')
      ).toBeTruthy();
    });
  });
});
