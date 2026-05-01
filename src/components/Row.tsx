import { Tile } from './Tile';
import type { TileStatus } from '../types';

interface RowProps {
  guess: string;
  targetWord?: string;
  isEvaluated?: boolean;
}

export function Row({ guess, targetWord, isEvaluated = false }: RowProps) {
  const letters = guess.split('');
  const emptyTiles = Array.from({ length: 5 - letters.length });

  // Jednoduchá logika evaluace
  const getStatus = (letter: string, index: number): TileStatus => {
    if (!isEvaluated || !targetWord) return 'filled';
    
    if (targetWord[index] === letter) {
      return 'correct';
    }
    if (targetWord.includes(letter)) {
      return 'present';
    }
    return 'absent';
  };

  return (
    <div className="grid grid-cols-5 gap-1.5 sm:gap-2 w-full h-full">
      {letters.map((letter, i) => (
        <Tile key={i} letter={letter} status={getStatus(letter, i)} />
      ))}
      {emptyTiles.map((_, i) => (
        <Tile key={`empty-${i}`} />
      ))}
    </div>
  );
}
