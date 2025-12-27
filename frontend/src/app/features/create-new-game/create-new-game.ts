import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GameService } from '../../shared/services/game.service';
import { GameStatus, Game } from '../../shared/model/game.model';

@Component({
  selector: 'app-create-new-game',
  standalone: false,
  templateUrl: './create-new-game.html',
  styleUrl: './create-new-game.scss',
})
export class CreateNewGameComponent implements OnInit {
  // Form group for creating a new game
  createGameForm!: FormGroup;

  /**
   * Constructor initializes required services for form creation, navigation, and notifications.
   *
   * @param fb FormBuilder for constructing reactive forms.
   * @param gameService Service for handling game-related operations.
   * @param router Angular Router for navigation.
   * @param snackBar Angular Material Snackbar for user notifications.
   */
  constructor(
    private fb: FormBuilder,
    private gameService: GameService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  /**
   * Initializes the form with validators for all fields.
   */
  ngOnInit(): void {
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
        timeLimit: formValue.timeLimit || undefined,
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
      error: (error: unknown) => {
        // Show error message
        this.snackBar.open(
          'Fehler beim Erstellen des Spiels. Bitte versuchen Sie es erneut.',
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
}

