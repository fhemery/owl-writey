import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { signal, WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuHarness } from '@angular/material/menu/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, UserProfile, UserService } from '@owl/front/auth';
import { TestUtils } from '@owl/front/test-utils';
import { Role } from '@owl/shared/common/contracts';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let mockUserService: Partial<AuthService>;
  let userSignal: WritableSignal<UserProfile | null>;
  let testUtils: TestUtils;
  let loader: HarnessLoader;

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
    loader = TestbedHarnessEnvironment.loader(fixture);
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

    it('should display the user menu', async () => {
      expect(testUtils.hasElement('.header__user-menu')).toBeTruthy();

      const [firstMenu] = await loader.getAllHarnesses(MatMenuHarness);
      expect(await firstMenu.getTriggerText()).toContain('Alice');
    });

    it('should display dashboard and logout buttons when opening the menu', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();

      const items = await menu.getItems();
      expect(items.length).toBe(2);

      expect(await items[0].getText()).toContain('home.header.dashboardLink');
      expect(await items[1].getText()).toContain('home.header.logoutLink');
    });

    it('should redirect to dashboard when clicking on dashboard link', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();

      const items = await menu.getItems();
      await items[0].click();
      await testUtils.waitStable();

      const router = TestBed.inject(Router);
      expect(router.url).toBe('/dashboard');
    });

    it('should redirect to logout when clicking on logout link', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();

      const items = await menu.getItems();
      await items[1].click();
      await testUtils.waitStable();

      const router = TestBed.inject(Router);
      expect(router.url).toBe('/login/logout');
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

  describe('when user is a Beta user', () => {
    beforeEach(() => {
      userSignal.set(
        new UserProfile('alice-id', 'alice@test.com', 'Alice', [Role.Beta])
      );
      fixture.detectChanges();
    });

    it('should display the profile sub menu', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();

      const items = await menu.getItems();
      expect(items.length).toBe(3);
      expect(await items[1].getText()).toContain('home.header.profileLink');
    });

    it('should redirect to profile when clicking on profile link', async () => {
      const [menu] = await loader.getAllHarnesses(MatMenuHarness);
      await menu.open();

      const items = await menu.getItems();
      await items[1].click();
      await testUtils.waitStable();

      const router = TestBed.inject(Router);
      expect(router.url).toBe('/profile');
    });
  });
});
