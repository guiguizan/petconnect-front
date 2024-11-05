import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentMonthlySummaryComponent } from './appointment-monthly-summary.component';

describe('AppointmentMonthlySummaryComponent', () => {
  let component: AppointmentMonthlySummaryComponent;
  let fixture: ComponentFixture<AppointmentMonthlySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AppointmentMonthlySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentMonthlySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
