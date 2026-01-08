import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-login-field',
  standalone: false,
  templateUrl: './login-field.component.html',
  styleUrl: './login-field.component.scss'
})
export class LoginFieldComponent {
  /**
   * Form group passed as an input from the parent component.
   * Contains form controls and validation states for the associated field.
   */
  @Input() group!: FormGroup;
  /**
   * Controls the visibility of sensitive fields (e.g., password fields).
   * Initially set to true to hide the field content.
   */
  protected hide = true;
}
