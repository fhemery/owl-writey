import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ProfileHomePageComponent } from './profile-home-page.component';

describe('ProfileHomePageComponent', () => {
  let component: ProfileHomePageComponent;
  let fixture: ComponentFixture<ProfileHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileHomePageComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ProfileHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Add more specific tests here as needed based on component functionality
});
