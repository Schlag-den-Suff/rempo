import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { Game } from '../model/game.model';

/**
 * GameService provides functionality for managing games,
 * including creating, retrieving, updating, and deleting games.
 */
@Injectable({ providedIn: 'root' })
export class GameService {
  // Base URL for game-related API endpoints
  private apiUrl = environment.apiUrl.concat('/games');

  /**
   * Initializes the GameService instance.
   * @param {HttpClient} http - The HTTP client for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Creates a new game with the provided data.
   * @param gameData - The game data including name and settings.
   * @returns {Observable<Game>} - An observable that resolves with the created game.
   */
  createGame(gameData: Partial<Game>): Observable<Game> {
    return this.http.post<Game>(this.apiUrl, gameData);
  }

  /**
   * Retrieves a specific game by ID.
   * @param gameId - The ID of the game to retrieve.
   * @returns {Observable<Game>} - An observable that resolves with the game data.
   */
  getGame(gameId: string): Observable<Game> {
    return this.http.get<Game>(`${this.apiUrl}/${gameId}`);
  }

  /**
   * Retrieves all games for the current user.
   * @returns {Observable<Game[]>} - An observable that resolves with an array of games.
   */
  getUserGames(): Observable<Game[]> {
    return this.http.get<Game[]>(`${this.apiUrl}/my-games`);
  }

  /**
   * Updates an existing game.
   * @param gameId - The ID of the game to update.
   * @param gameData - The updated game data.
   * @returns {Observable<Game>} - An observable that resolves with the updated game.
   */
  updateGame(gameId: string, gameData: Partial<Game>): Observable<Game> {
    return this.http.put<Game>(`${this.apiUrl}/${gameId}`, gameData);
  }

  /**
   * Deletes a game by ID.
   * @param gameId - The ID of the game to delete.
   * @returns {Observable<void>} - An observable that completes when the game is deleted.
   */
  deleteGame(gameId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${gameId}`);
  }
}
