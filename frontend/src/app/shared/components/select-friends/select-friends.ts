import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '../../model/user.model';
import { UserService } from '../../services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-select-friends',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './select-friends.html',
  styleUrl: './select-friends.scss',
})
export class SelectFriendsComponent implements OnInit {
  @Input() excludeUserIds: string[] = []; // Users already added to the game
  @Output() friendSelected = new EventEmitter<User>();

  friends: User[] = [];
  filteredFriends: User[] = [];
  searchTerm: string = '';
  loading: boolean = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadFriends();
  }

  /**
   * Load friends from the service
   */
  loadFriends(): void {
    this.loading = true;
    const userId = localStorage.getItem('user_id') || '';
    
    this.userService.getFriends(userId).subscribe({
      next: (friends) => {
        this.friends = friends.filter(
          friend => !this.excludeUserIds.includes(friend.userId)
        );
        this.filteredFriends = [...this.friends];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading friends:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Filter friends based on search term
   */
  filterFriends(): void {
    const term = this.searchTerm.toLowerCase().trim();
    
    if (!term) {
      this.filteredFriends = [...this.friends];
      return;
    }

    this.filteredFriends = this.friends.filter(friend =>
      friend.username.toLowerCase().includes(term) ||
      friend.email.toLowerCase().includes(term) ||
      friend.first_name.toLowerCase().includes(term) ||
      friend.last_name.toLowerCase().includes(term)
    );
  }

  /**
   * Handle friend selection
   */
  onSelectFriend(friend: User): void {
    this.friendSelected.emit(friend);
  }

  /**
   * Clear search
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.filterFriends();
  }
}
