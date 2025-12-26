import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountCreationFieldComponent } from './account-creation-field.component';

describe('AccountCreationFieldComponent', () => {
  let component: AccountCreationFieldComponent;
  let fixture: ComponentFixture<AccountCreationFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccountCreationFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountCreationFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
