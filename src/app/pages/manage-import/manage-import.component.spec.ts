import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageImportComponent } from './manage-import.component';

describe('ManageImportComponent', () => {
  let component: ManageImportComponent;
  let fixture: ComponentFixture<ManageImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
