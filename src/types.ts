export type TileStatus = 'correct' | 'present' | 'absent' | 'empty' | 'filled';

export interface TileData {
  letter: string;
  status: TileStatus;
}

export interface GameSettings {
  wordLength: number;
  maxGuesses: number;
}

export interface GameState {
  guesses: string[];
  currentGuess: string;
  isGameOver: boolean;
  isGameWon: boolean;
  targetWord: string;
  settings: GameSettings;
}

export const DEFAULT_MAX_GUESSES = 6;
export const DEFAULT_WORD_LENGTH = 5;
