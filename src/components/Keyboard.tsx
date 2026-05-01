import { Key } from './Key';
import type { TileStatus } from '../types';

interface KeyboardProps {
  onKeyPress: (key: string) => void;
  guesses: string[];
  targetWord: string;
}

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Enter', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace']
];

export function Keyboard({ onKeyPress, guesses, targetWord }: KeyboardProps) {
  // Evaluace stavů kláves
  const keyStatuses: Record<string, TileStatus> = {};
  
  guesses.forEach(guess => {
    guess.split('').forEach((letter, i) => {
      if (targetWord[i] === letter) {
        keyStatuses[letter] = 'correct';
      } else if (targetWord.includes(letter) && keyStatuses[letter] !== 'correct') {
        keyStatuses[letter] = 'present';
      } else if (keyStatuses[letter] !== 'correct' && keyStatuses[letter] !== 'present') {
        keyStatuses[letter] = 'absent';
      }
    });
  });

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto pb-8 w-full">
      {ROWS.map((row, i) => (
        <div key={i} className="flex justify-center gap-1 sm:gap-1.5 w-full">
          {/* Odsazení pro prostřední řádek, aby vypadal jako na klasické klávesnici */}
          {i === 1 && <div className="flex-[0.5]"></div>}
          {row.map((key) => (
            <Key
              key={key}
              value={key}
              status={keyStatuses[key] || 'empty'}
              onClick={onKeyPress}
              isWide={key === 'Enter' || key === 'Backspace'}
            />
          ))}
          {i === 1 && <div className="flex-[0.5]"></div>}
        </div>
      ))}
    </div>
  );
}
