import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalUploader } from './modal-uploader';

describe('ModalUploader', () => {
  let component: ModalUploader;
  let fixture: ComponentFixture<ModalUploader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalUploader],
    }).compileComponents();

    fixture = TestBed.createComponent(ModalUploader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
