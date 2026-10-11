import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsManagement } from './leads-management';

describe('LeadsManagement', () => {
  let component: LeadsManagement;
  let fixture: ComponentFixture<LeadsManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadsManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(LeadsManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
