import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicDropdownsComponent } from './dynamic-dropdowns.component';

describe('DynamicDropdownsComponent', () => {
  let component: DynamicDropdownsComponent;
  let fixture: ComponentFixture<DynamicDropdownsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DynamicDropdownsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicDropdownsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
