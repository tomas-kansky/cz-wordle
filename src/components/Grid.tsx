import { Row } from './Row';

interface GridProps {
  guesses: string[];
  currentGuess: string;
  targetWord: string;
}

export function Grid({ guesses, currentGuess, targetWord }: GridProps) {
  const MAX_GUESSES = 6;
  const empties = Array.from({ length: MAX_GUESSES - 1 - guesses.length });

  return (
    <div className="grid grid-rows-6 gap-2 p-2 box-border w-full max-w-[350px] mx-auto aspect-[5/6]">
      {guesses.map((guess, i) => (
        <Row key={i} guess={guess} targetWord={targetWord} isEvaluated={true} />
      ))}
      
      {guesses.length < MAX_GUESSES && (
        <Row guess={currentGuess} targetWord={targetWord} isEvaluated={false} />
      )}
      
      {empties.map((_, i) => (
        <Row key={`empty-${i}`} guess="" />
      ))}
    </div>
  );
}
