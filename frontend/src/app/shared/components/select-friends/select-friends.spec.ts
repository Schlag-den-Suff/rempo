import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SelectFriendsComponent } from './select-friends';

describe('SelectFriendsComponent', () => {
  let component: SelectFriendsComponent;
  let fixture: ComponentFixture<SelectFriendsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectFriendsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectFriendsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
