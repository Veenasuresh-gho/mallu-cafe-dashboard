import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAdFile } from './upload-ad-file';

describe('UploadAdFile', () => {
  let component: UploadAdFile;
  let fixture: ComponentFixture<UploadAdFile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadAdFile],
    }).compileComponents();

    fixture = TestBed.createComponent(UploadAdFile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
});
