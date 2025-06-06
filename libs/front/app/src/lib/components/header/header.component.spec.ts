import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, UserProfile, UserService } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUserService: Partial<AuthService>;
  let userSignal: WritableSignal<UserProfile | null>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    userSignal = signal(null);
    mockUserService = {
      user: userSignal,
    };

    await TestBed.configureTestingModule({
      imports: [
        HeaderComponent,
        NoopAnimationsModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: UserService, useValue: mockUserService },
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
    });

    it('should not display the user menu', () => {
      expect(testUtils.hasElement('.header__user-menu')).toBeFalsy();
    });

    it('should have logo redirecting to home page', async () => {
      const elem = testUtils.getElementAt('.header__app-title');

      expect(elem.getAttribute('href')).toBe('/');
    });
  });

  describe('when logged in', () => {
    beforeEach(() => {
      userSignal.set(
        new UserProfile('alice-id', 'alice@test.com', 'Alice', [])
      );
      fixture.detectChanges();
    });

    it('should display the user menu', () => {
      expect(testUtils.hasElement('.header__user-menu')).toBeTruthy();
    });

    it('should not display login and register buttons', () => {
      expect(testUtils.hasElement('.header__login-button')).toBeFalsy();
      expect(testUtils.hasElement('.header__register-button')).toBeFalsy();
    });

    it('should have logo redirecting to dashboard page', async () => {
      const elem = testUtils.getElementAt('.header__app-title');

      expect(elem.getAttribute('href')).toBe('/dashboard');
    });
  });
});
