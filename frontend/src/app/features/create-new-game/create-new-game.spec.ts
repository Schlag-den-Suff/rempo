import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewGameComponent } from './create-new-game';

describe('CreateNewGameComponent', () => {
  let component: CreateNewGameComponent;
  let fixture: ComponentFixture<CreateNewGameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNewGameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
