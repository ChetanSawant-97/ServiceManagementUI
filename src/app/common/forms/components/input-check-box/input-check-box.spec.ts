import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputCheckBox } from './input-check-box';

describe('InputCheckBox', () => {
  let component: InputCheckBox;
  let fixture: ComponentFixture<InputCheckBox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputCheckBox],
    }).compileComponents();

    fixture = TestBed.createComponent(InputCheckBox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
