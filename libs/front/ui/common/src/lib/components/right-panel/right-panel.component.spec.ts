import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { TestUtils } from '@owl/front/test-utils';

import { BaseRightPaneComponent } from './components/base-right-pane.component';
import { RightPanelComponentDisplayRequest } from './model/right-panel-component-display.request';
import { RightPanelComponent } from './right-panel.component';
import { RightPanelService } from './services/right-panel.service';

class RightPanelData {
  constructor(readonly theAnswer = 42) {}
}

@Component({
  selector: 'owl-right-panel-inner-test',
  standalone: true,
  template:
    '<div id="data">{{data()?.theAnswer}}</div>' +
    '<button id="closeBtn" (click)="close.emit()"></button>',
})
export class RightPanelInnerTestComponent extends BaseRightPaneComponent<RightPanelData> {}

describe('RightPaneComponent', () => {
  let component: RightPanelComponent;
  let fixture: ComponentFixture<RightPanelComponent>;
  let testUtils: TestUtils;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RightPanelComponent, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(RightPanelComponent);
    component = fixture.componentInstance;
    testUtils = new TestUtils(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when injecting a component', () => {
    it('should display the component', () => {
      const service = TestBed.inject(RightPanelService);
      service.displayComponent(
        new RightPanelComponentDisplayRequest<RightPanelData>(
          RightPanelInnerTestComponent,
          new RightPanelData()
        )
      );
      fixture.detectChanges();

      expect(testUtils.hasElement('owl-right-panel-inner-test')).toBe(true);
    });

    it('should bind data correctly', () => {
      const rightPanelData = new RightPanelData();

      const service = TestBed.inject(RightPanelService);
      service.displayComponent(
        new RightPanelComponentDisplayRequest<RightPanelData>(
          RightPanelInnerTestComponent,
          rightPanelData
        )
      );
      fixture.detectChanges();

      expect(testUtils.getTextForElementAt('#data')).toBe(
        rightPanelData.theAnswer.toString()
      );
    });
  });
});
