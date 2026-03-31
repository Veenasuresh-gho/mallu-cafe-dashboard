import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomFilterCalender } from './custom-filter-calender';

describe('CustomFilterCalender', () => {
  let component: CustomFilterCalender;
  let fixture: ComponentFixture<CustomFilterCalender>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomFilterCalender],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomFilterCalender);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
