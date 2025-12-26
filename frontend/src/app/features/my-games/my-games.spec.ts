import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGamesComponent } from './my-games';

describe('MyGamesComponent', () => {
  let component: MyGamesComponent;
  let fixture: ComponentFixture<MyGamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyGamesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyGamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
