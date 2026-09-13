import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripLedger } from './trip-ledger';

describe('TripLedger', () => {
  let component: TripLedger;
  let fixture: ComponentFixture<TripLedger>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripLedger],
    }).compileComponents();

    fixture = TestBed.createComponent(TripLedger);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
