import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalytcsComponent } from './analytcs.component';

describe('AnalytcsComponent', () => {
  let component: AnalytcsComponent;
  let fixture: ComponentFixture<AnalytcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalytcsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalytcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
