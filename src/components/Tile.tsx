import type { TileStatus } from '../types';

interface TileProps {
  letter?: string;
  status?: TileStatus;
}

export function Tile({ letter = '', status = 'empty' }: TileProps) {
  let bgClass = 'bg-transparent border-slate-700';
  let animationClass = '';

  if (status === 'filled') {
    bgClass = 'bg-transparent border-slate-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]';
    animationClass = 'animate-pop';
  } else if (status === 'correct') {
    bgClass = 'bg-emerald-500 border-emerald-500 shadow-lg';
    animationClass = 'animate-flip';
  } else if (status === 'present') {
    bgClass = 'bg-amber-500 border-amber-500 shadow-lg';
    animationClass = 'animate-flip';
  } else if (status === 'absent') {
    bgClass = 'bg-slate-700 border-slate-700 shadow-lg';
    animationClass = 'animate-flip';
  }

  return (
    <div className={`w-full h-full flex items-center justify-center text-3xl font-bold uppercase border-2 rounded-xl transition-colors duration-300 ${bgClass} ${animationClass}`}>
      {letter}
    </div>
  );
}
