import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isDropdownOpen!: boolean; // Indicates whether the dropdown menu is currently open or not.
  @Input() isSideBarOpen!: boolean; //  Indicates whether the side navigation panel is currently open or not.
  @Input() isLoggedIn = false; // Indicates whether the user is currently logged in.
  @Output() toggleSidebarEvent = new EventEmitter<void>(); // Event emitter that emits an event when the sidebar needs to be toggled (opened or closed).
  @Output() toggleDropDownEvent = new EventEmitter<boolean>(); // Event emitter that emits an event when the dropdown menu needs to be toggled.

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  toggleDropdown(show: boolean) {
    this.toggleDropDownEvent.emit(show);
  }

  goToLandingPage(): void {
    // Close the dropdown if it is open
    if (this.isDropdownOpen) this.toggleDropdown(false);
    // Close the sidebar if it is open
    if (this.isSideBarOpen) this.toggleSidebar();

    // Attempt to navigate to the landing page
    this.router
      .navigate(['/'])
      .then()
      .catch(() => {
        // Display an error message in the snackbar if navigation fails
        this.snackBar.open('Navigation zur Landingpage ist fehlgeschlagen', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      });
  }

  toggleSidebar() {
    this.toggleSidebarEvent.emit();
  }
}
