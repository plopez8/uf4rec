import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JocComponent } from './joc.component';

describe('JocComponent', () => {
  let component: JocComponent;
  let fixture: ComponentFixture<JocComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JocComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
