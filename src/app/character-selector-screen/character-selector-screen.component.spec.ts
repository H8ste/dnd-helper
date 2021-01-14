import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSelectorScreenComponent } from './character-selector-screen.component';

describe('CharacterSelectorScreenComponent', () => {
  let component: CharacterSelectorScreenComponent;
  let fixture: ComponentFixture<CharacterSelectorScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterSelectorScreenComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CharacterSelectorScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
