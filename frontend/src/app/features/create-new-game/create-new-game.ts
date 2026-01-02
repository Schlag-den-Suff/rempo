import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import {GameService} from '../../shared/services/game.service';
import {Game, GameStatus} from '../../shared/model/game.model';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {User} from '../../shared/model/user.model';
import {AddUser} from '../../shared/components/add-user/add-user';
import {MatDialog} from '@angular/material/dialog.d';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-create-new-game',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatIconModule,
    MatCardModule,
    MatCheckboxModule,
    MatButtonModule,
    MatSnackBarModule,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatTable,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef
  ],
  templateUrl: './create-new-game.html',
  styleUrl: './create-new-game.scss',
})
export class CreateNewGameComponent implements OnInit {

  // Form group for creating a new game
  userID: string = '';
  createGameForm!: FormGroup;
  displayedColumns: string[] = ['username', 'email', 'role', 'delete'];
  tableData: User[] = [];
  subscriptions: Subscription[] = []; // Subscriptions for managing observables.

  /**
   * Constructor initializes required services for form creation, navigation, and notifications.
   *
   * @param fb FormBuilder for constructing reactive forms.
   * @param gameService Service for handling game-related operations.
   * @param router Angular Router for navigation.
   * @param snackBar Angular Material Snackbar for user notifications.
   * @param dialog
   */
  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  /**
   * Initializes the form with validators for all fields.
   */
  ngOnInit(): void {
    this.userID = localStorage.getItem('user_id') || '';
    console.log('UserID:', this.userID);
    this.createGameForm = this.fb.group({
      // Game name field with required validation
      game_name: ['', [Validators.required, Validators.minLength(3)]],
      // Game type field with required validation
      type: ['Quiz', [Validators.required]],
      // Questions per player with required and range validation
      questionsPerPlayer: [5, [Validators.required, Validators.min(1), Validators.max(50)]],
      // Time limit in minutes (optional)
      timeLimit: [30, [Validators.min(1), Validators.max(180)]],
      // Allow hints toggle
      allowHints: [true],
      // Randomize questions toggle
      randomizeQuestions: [true],
    });

    //this.setupUserTable();
  }

  /**
   * Handles form submission to create a new game.
   * Submits the form data to the backend and processes the response.
   */
  onCreateGame(): void {
    if (this.createGameForm.invalid) {
      return;
    }

    const formValue = this.createGameForm.value;

    // Prepare game data according to the Game model
    const gameData = {
      game_name: formValue.game_name,
      game_status: GameStatus.PLANNING,
      game_settings: {
        type: formValue.type,
        questionsPerPlayer: formValue.questionsPerPlayer,
        timeLimit: formValue.timeLimit,
        allowHints: formValue.allowHints,
        randomizeQuestions: formValue.randomizeQuestions,
      },
      game_players: [], // Empty at the beginning
      game_questions: [], // Empty at the beginning
    };

    this.gameService.createGame(gameData).subscribe({
      next: (game: Game) => {
        // Show success message
        this.snackBar.open(
          `Spiel "${game.game_name}" erfolgreich erstellt!`,
          'X',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
        // Navigate to game management or my games page
        this.router.navigate(['/game-management']);
      },
      error: (error: { error?: string; message?: string }) => {
        // Show error message
        const errorMessage = error.error || error.message || 'Fehler beim Erstellen des Spiels. Bitte versuchen Sie es erneut.';
        this.snackBar.open(
          errorMessage,
          'X',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );
        console.error('Error creating game:', error);
      },
    });
  }

  /**
   * Cancels game creation and navigates back to my games page.
   */
  onCancel(): void {
    this.router.navigate(['/my-games']);
  }

  private setupUserTable() {
    this.tableData.push({
      userId: 'asdf',
      username: 'wrwasdfg',
      email: 'ertzwe',
      first_name: 'qvsadgg',
      last_name: 'dfghshetr'
    } as User)
    this.tableData.push({
      userId: 'wetwtew',
      username: 'wrwasdfg',
      email: 'ertzwe',
      first_name: 'qvsadgg',
      last_name: 'dfghshetr'
    } as User)
  }

  removePlayer(element: User) {
    console.log('Remove player', element);
  }

  onAddUser() {
    const dialogRef = this.dialog.open(AddUser, {
    });
    this.subscriptions.push(
      dialogRef
        .afterClosed()
        .subscribe((result: User | undefined) => {
          if (result) {
            this.tableData.push(result);
            this.tableData = [...this.tableData];
          }
        })
    );
  }
}

