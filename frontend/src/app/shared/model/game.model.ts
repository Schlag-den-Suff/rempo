import {User} from './user.model';

export interface Game {
  CreatedAt: Date;
  Owner: User;
  GameName: string;
  Players: User[];
  GameQuestions: GameQuestion[];
  Settings: GameSettings;
}

export interface GameSettings {
  type: string;
}

export interface GameQuestion {
  Question: string;
  Hint1: string;
  Hint2: string;
  Answer: string;
}
