import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE, AuthService } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';

import { RegisterPageComponent } from './register-page.component';
import { UserService } from './services/user.service';

describe('RegisterPageComponent', () => {
  let component: RegisterPageComponent;
  let fixture: ComponentFixture<RegisterPageComponent>;
  let authService: Partial<AuthService>;
  let userService: Partial<UserService>;
  let testUtils: TestUtils;
  let routerSpy: Partial<Router>;

  beforeEach(() => {
    authService = {
      register: vi.fn().mockResolvedValue(true),
    } as Partial<AuthService>;

    userService = {
      createUser: vi.fn().mockResolvedValue(true),
    } as Partial<UserService>;
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RegisterPageComponent,
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [
        { provide: AUTH_SERVICE, useValue: authService },
        { provide: UserService, useValue: userService },
        provideRouter([{ path: '**', component: RegisterPageComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterPageComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router);
    routerSpy.navigateByUrl = vi.fn().mockResolvedValue(true);
    fixture.detectChanges();

    testUtils = new TestUtils(fixture);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(testUtils.hasText('register.title', 'h2')).toBeTruthy();
  });

  it('should display the register component', () => {
    expect(testUtils.hasElement('owl-register')).toBeTruthy();
  });

  describe('success cases', () => {
    it('should call the authService with the correct data when register form is submitted', async () => {
      testUtils.updateInputField('input[name="name"]', 'Test User');
      testUtils.updateInputField('input[name="email"]', 'test@test.fr');
      testUtils.updateInputField('input[name="password"]', 'password123');
      testUtils.updateInputField('input[name="repeatPassword"]', 'password123');

      await testUtils.submitReactiveForm('#registerForm');

      expect(authService.register).toHaveBeenCalledWith(
        'test@test.fr',
        'password123'
      );
      expect(userService.createUser).toHaveBeenCalledWith('Test User');

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('errors', () => {
    it('should set registerError to true if registration fails', async () => {
      authService.register = vi.fn().mockResolvedValue(false);

      testUtils.updateInputField('input[name="name"]', 'Test User');
      testUtils.updateInputField('input[name="email"]', 'test@test.fr');
      testUtils.updateInputField('input[name="password"]', 'password123');
      testUtils.updateInputField('input[name="repeatPassword"]', 'password123');

      await testUtils.submitReactiveForm('#registerForm');

      expect(testUtils.hasElement('.error-panel')).toBeTruthy();
      expect(userService.createUser).not.toHaveBeenCalled();
      expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
    });

    it('should display an error when name is not provided', async () => {
      testUtils.updateInputField('input[name="name"]', '');
      expect(
        testUtils.hasText('register.form.name.error.required', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when name is too short', async () => {
      testUtils.updateInputField('input[name="name"]', 'Te');
      expect(
        testUtils.hasText('register.form.name.error.minlength', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when email is not provided', async () => {
      testUtils.updateInputField('input[name="email"]', '');
      expect(
        testUtils.hasText('register.form.email.error.required', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when email is not an email', async () => {
      testUtils.updateInputField('input[name="email"]', 'test');
      expect(
        testUtils.hasText('register.form.email.error.invalid', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when password is not provided', async () => {
      testUtils.updateInputField('input[name="password"]', '');
      expect(
        testUtils.hasText('register.form.password.error.required', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when password is too short', async () => {
      testUtils.updateInputField('input[name="password"]', 'pass');
      expect(
        testUtils.hasText('register.form.password.error.minlength', 'mat-error')
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when repeatPassword is not provided', async () => {
      testUtils.updateInputField('input[name="repeatPassword"]', '');
      expect(
        testUtils.hasText(
          'register.form.repeatPassword.error.required',
          'mat-error'
        )
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });

    it('should display an error when passwords do not match', async () => {
      testUtils.updateInputField('input[name="password"]', 'password1');
      testUtils.updateInputField('input[name="repeatPassword"]', 'password2');
      expect(
        testUtils.hasText(
          'register.form.error.passwordNotMatching',
          '.form-error'
        )
      ).toBeTruthy();
      expect(testUtils.isDisabled('#registerBtn')).toBeTruthy();
    });
  });
});
