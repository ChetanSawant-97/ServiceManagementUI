import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TripMaster } from './trip-master';

describe('TripMaster', () => {
  let component: TripMaster;
  let fixture: ComponentFixture<TripMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TripMaster],
    }).compileComponents();

    fixture = TestBed.createComponent(TripMaster);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
