import { Row } from './Row';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
  wordLength: number;
  maxGuesses: number;
}

export function Grid({ guesses, currentGuess, targetWord, wordLength, maxGuesses }: GridProps) {
  const empties = Array.from({ length: Math.max(0, maxGuesses - 1 - guesses.length) });

  return (
    <div 
      className="grid gap-1.5 sm:gap-2 p-1 w-full mx-auto"
      style={{
        gridTemplateRows: `repeat(${maxGuesses}, minmax(0, 1fr))`,
        maxWidth: `${Math.min(350, wordLength * 70)}px`,
        maxHeight: '100%',
        aspectRatio: `${wordLength} / ${maxGuesses}`
      }}
    >
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} targetWord={targetWord} isEvaluated={true} wordLength={wordLength} />
      ))}
      
      {guesses.length < maxGuesses && (
        <Row guess={currentGuess} targetWord={targetWord} isEvaluated={false} wordLength={wordLength} />
      )}
      
      {empties.map((_, i) => (
        <Row key={`empty-${i}`} guess="" wordLength={wordLength} />
      ))}
    </div>
  );
}
