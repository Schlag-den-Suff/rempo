import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../auth/auth.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  // Reactive form group for login input fields.
  loginForm!: FormGroup;

  /**
   * Constructor to inject dependencies for form building, navigation, authentication, and notifications.
   *
   * @param router Angular Router for navigation.
   * @param fb FormBuilder to create reactive forms.
   * @param authService Service to handle authentication logic.
   * @param snackBar Material Snackbar for displaying notifications.
   */
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook to initialize the login form with validation rules.
   */
  ngOnInit(): void {
    this.loginForm = this.fb.group({
      // Username field with required validation.
      username: ['', [Validators.required, Validators.minLength(4)]],
      // Password field with required and minimum length validation.
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  /**
   * Navigates the user to the account registration page.
   * Called when the "Konto Erstellen" button is clicked.
   */
  onKontoErstellen() {
    this.router.navigate(['registrieren']);
  }

  /**
   * Submits the login form data to the backend for authentication.
   * Handles server responses, sets appropriate error messages, and navigates on success.
   */
  onLogin() {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    // Call the login method of the AuthService and handle the response.
    this.authService.login(username, password).subscribe({
      next: response => {
        // Save tokens and user ID to local storage upon successful login.
        this.authService.storeAccessToken(response.body.access);
        localStorage.setItem('refresh_token', response.body.refresh);
        localStorage.setItem('id', response.body.id);

        // Navigate to the application's home page.
        this.router.navigate(['/']);
      },
      error: errorResponse => {
        const errorMessage = errorResponse?.error ?? '';
        if (errorMessage === 'userNameNotRegistered') {
          this.loginForm.get('username')!.setErrors({ usernameNotRegistered: true });
        } else if (errorMessage === 'passwordOrUserNameWrong') {
          this.loginForm.get('password')!.setErrors({ passwordOrUserNameWrong: true });
          this.loginForm.get('username')!.setErrors({ passwordOrUserNameWrong: true });
        } else {
          // Show a generic error message using Snackbar for unexpected errors.
          this.snackBar.open(
            'Beim Login ist etwas schief gelaufen, versuchen Sie es nach einiger Zeit erneut!',
            'X',
            {
              duration: 3000, // Duration for the Snackbar message in milliseconds.
              horizontalPosition: 'center', // Snackbar position (centered horizontally).
              verticalPosition: 'top', // Snackbar position (at the top of the screen).
            }
          );
        }
      },
    });
  }
}

