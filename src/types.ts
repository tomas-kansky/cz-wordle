export type TileStatus = 'correct' | 'present' | 'absent' | 'empty' | 'filled';

export interface TileData {
  letter: string;
  status: TileStatus;
}

export interface GameState {
  guesses: string[];
  currentGuess: string;
  isGameOver: boolean;
  isGameWon: boolean;
  targetWord: string;
}

export const MAX_GUESSES = 6;
export const WORD_LENGTH = 5;
