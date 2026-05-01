import React from 'react';
import type { GameSettings } from '../types';

interface SetupScreenProps {
  settings: GameSettings;
  onStart: (newSettings: GameSettings) => void;
}

export function SetupScreen({ settings, onStart }: SetupScreenProps) {
  const [wordLength, setWordLength] = React.useState(settings.wordLength);
  const [maxGuesses, setMaxGuesses] = React.useState(settings.maxGuesses);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ wordLength, maxGuesses });
  };

  const lengths = [4, 5, 6];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 bg-slate-950 overflow-hidden">
      {/* Dynamické pozadí */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-sky-500/10 blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-500/10 blur-[120px] rounded-full animate-pulse delay-700"></div>

      <div className="w-full max-w-md relative z-10">
        <header className="text-center mb-12 animate-in slide-in-from-top duration-700">
          <h1 className="text-5xl font-black tracking-tighter bg-gradient-to-br from-white to-slate-500 text-transparent bg-clip-text mb-2">
            WORDLE.CZ
          </h1>
          <p className="text-slate-400 font-medium">Nastav si svou hru a začni hádat</p>
        </header>

        <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] shadow-2xl p-8 backdrop-blur-xl animate-in zoom-in-95 duration-500">
          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-5">
              <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Počet písmen</label>
              <div className="grid grid-cols-3 gap-4">
                {lengths.map((len) => (
                  <button
                    key={len}
                    type="button"
                    onClick={() => setWordLength(len)}
                    className={`
                      h-24 rounded-3xl flex flex-col items-center justify-center transition-all duration-500 border-2
                      ${wordLength === len 
                        ? 'bg-sky-500/20 border-sky-500 text-sky-400 shadow-[0_0_30px_rgba(56,189,248,0.2)] scale-105' 
                        : 'bg-slate-800/30 border-white/5 text-slate-500 hover:border-white/20 hover:bg-slate-800/50'
                      }
                    `}
                  >
                    <span className="text-4xl font-black">{len}</span>
                    <span className="text-[10px] uppercase font-black tracking-widest mt-1">Písmen</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex justify-between items-end ml-1">
                <label className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Počet pokusů</label>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black text-violet-400 leading-none">{maxGuesses}</span>
                  <span className="text-[10px] font-black text-slate-600 uppercase">Pokusů</span>
                </div>
              </div>
              <div className="px-1 pt-2">
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  value={maxGuesses} 
                  onChange={(e) => setMaxGuesses(parseInt(e.target.value))}
                  className="w-full h-3 bg-slate-800 rounded-full appearance-none cursor-pointer accent-violet-500 outline-none hover:accent-violet-400 transition-all"
                />
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-6 rounded-3xl bg-gradient-to-r from-sky-500 to-violet-500 text-white font-black uppercase tracking-[0.15em] shadow-[0_15px_35px_rgba(56,189,248,0.25)] hover:shadow-sky-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 text-xl"
              >
                Spustit hru
              </button>
            </div>
          </form>

          {/* Export nahlášených slov */}
          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => {
                const reported = JSON.parse(localStorage.getItem('wordle-reported-words') || '[]');
                if (reported.length === 0) {
                  alert('Zatím nebyla nahlášena žádná slova.');
                } else {
                  prompt('Nahlášená slova (zkopíruj a pošli AI pro vymazání):', reported.join(', '));
                }
              }}
              className="text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-slate-400 transition-colors"
            >
              Správa nahlášených slov ({JSON.parse(localStorage.getItem('wordle-reported-words') || '[]').length})
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
