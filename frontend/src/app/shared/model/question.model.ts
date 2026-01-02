export interface GameQuestion {
  question_id: string;
  user_id: number;
  question_text: string;
  question_hint1: string;
  question_hint2: string;
  question_answer: string;
  rating: number;
  weight: number;
}
