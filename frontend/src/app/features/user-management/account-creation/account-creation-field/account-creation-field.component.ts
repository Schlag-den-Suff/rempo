import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-account-creation-field',
  standalone: false,
  templateUrl: './account-creation-field.component.html',
  styleUrl: './account-creation-field.component.scss'
})
export class AccountCreationFieldComponent {
  /**
   * Form group passed as an input from the parent component.
   * Contains form controls and validation states for the associated field.
   */
  @Input() group!: FormGroup;
  /**
   * Controls the visibility of sensitive fields (e.g., password fields).
   * Initially set to true to hide the field content.
   */
  hide = true;
}
