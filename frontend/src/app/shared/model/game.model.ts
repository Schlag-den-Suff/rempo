import { GameQuestion } from './question.model.ts';
export interface Game {
  game_id: string
  Owner_id: string;
  created_at: Date;
  game_name: string;
  game_status: GameStatus
  game_players: GamePlayers[];
  game_settings: GameSettings;
  game_questions: GameQuestion[];
}

export enum GameStatus {
  PLANNING = 'Planung',
  SCHEDULED = 'Terminierung',
  CLOSED = 'Abgeschlossen',
}

export enum PlayerRole {
  ADMIN = 'Administrator',
  MODERATER = 'Moderator',
  USER = 'Benutzer',
}

export interface GamePlayers {
  user_id: string;
  role: PlayerRole;
}

export interface GameSettings {
  type: string;
}
