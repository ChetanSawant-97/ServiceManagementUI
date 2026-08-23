import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackSales } from './track-sales';

describe('TrackSales', () => {
  let component: TrackSales;
  let fixture: ComponentFixture<TrackSales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrackSales],
    }).compileComponents();

    fixture = TestBed.createComponent(TrackSales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
