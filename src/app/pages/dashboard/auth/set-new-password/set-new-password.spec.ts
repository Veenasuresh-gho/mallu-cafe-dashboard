import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetNewPassword } from './set-new-password';

describe('SetNewPassword', () => {
  let component: SetNewPassword;
  let fixture: ComponentFixture<SetNewPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetNewPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(SetNewPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
