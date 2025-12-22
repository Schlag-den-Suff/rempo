import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {matchValidator} from '../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-account-creation',
  standalone: false,
  templateUrl: './account-creation.component.html',
  styleUrl: './account-creation.component.scss'
})
export class AccountCreationComponent implements OnInit {
  // Form group for user account creation.
  creationForm!: FormGroup;

  /**
   * Constructor initializes required services for form creation, navigation, authentication, and notifications.
   *
   * @param router Angular Router for navigation.
   * @param fb FormBuilder for constructing reactive forms.
   * @param authService Service for handling authentication-related operations.
   * @param snackBar Angular Material Snackbar for user notifications.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Initiates the Form and sets the Validators for all the fields
   */
  ngOnInit(): void {
    this.creationForm = this.fb.group(
      {
        // Email field with required and email format validation.
        email: ['', [Validators.required, Validators.email]],
        // Username field with required and minimum length validation.
        username: ['', [Validators.required, Validators.minLength(4)]],
        // Password field with required and minimum length validation.
        password: ['', [Validators.required, Validators.minLength(8)]],
        // Confirm password field with required validation.
        confirmPassword: ['', [Validators.required]],
        // Checkbox for privacy policy acceptance with required validation.
        acceptedPrivacyPolicy: ['', [Validators.required, Validators.requiredTrue]],
      },
      {
        // Custom validator to ensure password and confirm password match.
        validators: matchValidator('password', 'confirmPassword'),
      }
    );
  }

  /**
   * Handles form submission when the "Weiter" button is clicked.
   * Submits the form data to the backend and processes the response.
   *
   * If the email or username already exists, sets corresponding error messages on the form.
   * Displays a generic error message if an unexpected error occurs.
   */
  onWeiter() {
    const email = this.creationForm.get('email')?.value;
    const username = this.creationForm.get('username')?.value;
    const password = this.creationForm.get('password')?.value;
    this.authService.register(username, email, password).subscribe({
      next: () => {
        // Navigate to the login page upon successful registration.
        this.router.navigate(['login']);
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error;
        // Set appropriate form errors based on the backend response.
        if (errorMessage === 'Email already exists') {
          this.creationForm.get('email')!.setErrors({ emailAlreadyRegistered: true });
        } else if (errorMessage === 'Username already exists') {
          this.creationForm.get('username')!.setErrors({ usernameAlreadyTaken: true });
        } else {
          // Show a snackbar notification for unexpected errors.
          this.snackBar.open(
            'Bei der Registrierung ist etwas schief gelaufen, versuchen Sie es nach einiger Zeit erneut!',
            'X',
            {
              duration: 3000, // Snackbar display duration in milliseconds.
              horizontalPosition: 'center', // Snackbar horizontal alignment.
              verticalPosition: 'top', // Snackbar vertical alignment.
            }
          );
        }
      },
    });
  }

  /**
   * Navigates the user to the login page when the "Login" button is clicked.
   */
  onLogin() {
    this.router.navigate(['login']);
  }
}
