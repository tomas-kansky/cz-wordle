import type { TileStatus } from '../types';

interface KeyProps {
  value: string;
  status: TileStatus;
  onClick: (value: string) => void;
  isWide?: boolean;
}

export function Key({ value, status, onClick, isWide = false }: KeyProps) {
  let bgClass = 'glass-panel hover:bg-slate-700';

  if (status === 'correct') {
    bgClass = 'bg-emerald-500 border-transparent text-white';
  } else if (status === 'present') {
    bgClass = 'bg-amber-500 border-transparent text-white';
  } else if (status === 'absent') {
    bgClass = 'bg-slate-700 border-transparent text-white';
  }

  const displayValue = value === 'Backspace' ? '⌫' : value;

  return (
    <button
      onClick={() => onClick(value)}
      className={`
        ${bgClass}
        ${isWide ? 'flex-[1.5] text-xs sm:text-sm px-1' : 'flex-1 text-sm sm:text-lg'}
        h-[48px] sm:h-[55px] flex items-center justify-center font-bold uppercase rounded-md sm:rounded-lg
        transition-all duration-200 cursor-pointer select-none
        hover:-translate-y-[2px] active:translate-y-[1px]
        border border-white/10
      `}
    >
      {displayValue}
    </button>
  );
}
