import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesPersonnel } from './sales-personnel';

describe('SalesPersonnel', () => {
  let component: SalesPersonnel;
  let fixture: ComponentFixture<SalesPersonnel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesPersonnel],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesPersonnel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
