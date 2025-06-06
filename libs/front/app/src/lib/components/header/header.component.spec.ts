import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AUTH_SERVICE, AuthService, User } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockAuthService: Partial<AuthService>;
  let userSignal: WritableSignal<User | null>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    userSignal = signal(null);
    mockAuthService = {
      user: userSignal,
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AUTH_SERVICE, useValue: mockAuthService },
        provideRouter([{ path: '**', component: HeaderComponent }]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when not logged in', () => {
    beforeEach(() => {
      userSignal.set(null);
      fixture.detectChanges();
    });

    it('should show login and register buttons', () => {
      expect(testUtils.hasElement('.header__login-button')).toBeTruthy();
      expect(testUtils.hasElement('.header__register-button')).toBeTruthy();
      expect(testUtils.hasElement('.header__logout-button')).toBeFalsy();
    });

    it('should have logo redirecting to home page', async () => {
      const elem = testUtils.getElementAt('.header__app-title');

      expect(elem.getAttribute('href')).toBe('/');
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      userSignal.set(new User('alice-id', 'alice@test.com', []));
      fixture.detectChanges();
    });

    it('should show logout button', () => {
      expect(testUtils.hasElement('.header__logout-button')).toBeTruthy();
      expect(testUtils.hasElement('.header__login-button')).toBeFalsy();
      expect(testUtils.hasElement('.header__register-button')).toBeFalsy();
    });

    it('should have logo redirecting to dashboard page', async () => {
      const elem = testUtils.getElementAt('.header__app-title');

      expect(elem.getAttribute('href')).toBe('/dashboard');
    });

    it('should redirect to logout', async () => {
      testUtils.clickElementAt('.header__logout-button button');

      const router = TestBed.inject(Router);
      expect(router.url).toBe('/login/logout');
    });
  });
});
