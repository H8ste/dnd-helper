import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpellScreenComponent } from './spell-screen.component';

describe('SpellScreenComponent', () => {
  let component: SpellScreenComponent;
  let fixture: ComponentFixture<SpellScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpellScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpellScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
