import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchManagerComponent } from './branch-manager-component';

describe('AreasComponent', () => {
  let component: BranchManagerComponent;
  let fixture: ComponentFixture<BranchManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchManagerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BranchManagerComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
