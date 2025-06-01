import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymbologyGeneratedComponent } from './symbology-generated.component';

describe('SymbologyGeneratedComponent', () => {
  let component: SymbologyGeneratedComponent;
  let fixture: ComponentFixture<SymbologyGeneratedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymbologyGeneratedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SymbologyGeneratedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
