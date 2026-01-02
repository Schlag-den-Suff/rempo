import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './add-user.html',
  styleUrl: './add-user.scss',
})
export class AddUser {
  searchTerm: string = '';
  searching: boolean = false;
  foundUser: User | null = null;
  notFound: boolean = false;
  showInvitePrompt: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<AddUser>,
    private userService: UserService,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Search for a user by email or username
   */
  onSearch(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.searching = true;
    this.foundUser = null;
    this.notFound = false;
    this.showInvitePrompt = false;

    this.userService.searchUser(this.searchTerm.trim()).subscribe({
      next: (user) => {
        this.searching = false;
        if (user) {
          this.foundUser = user;
          this.notFound = false;
        } else {
          this.foundUser = null;
          this.notFound = true;
          // Check if search term is an email
          if (this.isEmail(this.searchTerm)) {
            this.showInvitePrompt = true;
          }
        }
      },
      error: (error) => {
        console.error('Error searching user:', error);
        this.searching = false;
        this.notFound = true;
        this.snackBar.open(
          'Fehler bei der Suche. Bitte versuchen Sie es erneut.',
          'X',
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Add the found user to the game
   */
  onAddUser(): void {
    if (this.foundUser) {
      this.dialogRef.close(this.foundUser);
    }
  }

  /**
   * Send invitation to the email address
   */
  onSendInvite(): void {
    if (!this.isEmail(this.searchTerm)) {
      return;
    }

    this.searching = true;
    this.userService.sendInvitation(this.searchTerm.trim()).subscribe({
      next: () => {
        this.searching = false;
        this.snackBar.open(
          `Einladung wurde an ${this.searchTerm} gesendet`,
          'X',
          { duration: 5000 }
        );
        this.dialogRef.close();
      },
      error: (error) => {
        console.error('Error sending invitation:', error);
        this.searching = false;
        this.snackBar.open(
          'Fehler beim Senden der Einladung. Bitte versuchen Sie es erneut.',
          'X',
          { duration: 3000 }
        );
      }
    });
  }

  /**
   * Close the dialog
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Clear search and reset state
   */
  onClearSearch(): void {
    this.searchTerm = '';
    this.foundUser = null;
    this.notFound = false;
    this.showInvitePrompt = false;
  }

  /**
   * Check if a string is a valid email format
   */
  private isEmail(value: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }
}
