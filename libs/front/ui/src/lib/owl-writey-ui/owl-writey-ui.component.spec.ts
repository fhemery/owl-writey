import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwlWriteyUiComponent } from './owl-writey-ui.component';

describe('OwlWriteyUiComponent', () => {
  let component: OwlWriteyUiComponent;
  let fixture: ComponentFixture<OwlWriteyUiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OwlWriteyUiComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OwlWriteyUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
