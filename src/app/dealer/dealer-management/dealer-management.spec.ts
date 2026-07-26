import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DealerManagement } from './dealer-management';

describe('DealerManagement', () => {
  let component: DealerManagement;
  let fixture: ComponentFixture<DealerManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DealerManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(DealerManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
