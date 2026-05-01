import { useWordle } from './hooks/useWordle';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { SetupScreen } from './components/SetupScreen';
import { useEffect, useState, useCallback } from 'react';
import type { GameSettings } from './types';
import { DEFAULT_WORD_LENGTH, DEFAULT_MAX_GUESSES } from './types';

const SETTINGS_KEY = 'wordle-settings';
const STATE_KEY = 'wordle-state';

function Game({ 
  targetWord, 
  validWords, 
  settings,
  onOpenSetup
}: { 
  targetWord: string; 
  validWords: Set<string>; 
  settings: GameSettings;
  onOpenSetup: () => void;
}) {
  const { state, handleKeyup, toast } = useWordle(targetWord, validWords, settings);

  return (
    <>
      <div className="background-animation absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none z-0
                      bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_40%)] 
                      animate-[rotateBg_30s_linear_infinite]">
      </div>

      <div className="app-container mx-auto w-full max-w-[500px] h-[100dvh] flex flex-col relative z-10 px-1 sm:px-4 pt-2 pb-1 sm:pb-2 animate-in fade-in zoom-in-95 duration-500">
        <header className="flex justify-between items-center py-2 sm:py-4 border-b border-white/10 mb-4 sm:mb-8">
          <button 
            onClick={onOpenSetup}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Zpět do nastavení"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
          
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-widest bg-gradient-to-r from-sky-400 to-violet-500 text-transparent bg-clip-text drop-shadow-[0_4px_20px_rgba(56,189,248,0.3)]">
            WORDLE
          </h1>
          
          <button 
            onClick={onOpenSetup}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white"
            title="Nastavení"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
          </button>
        </header>

        <main className="game-board flex justify-center items-center flex-1 min-h-0 relative w-full overflow-hidden">
          {toast && (
            <div className="absolute top-[-10px] px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg font-bold shadow-lg animate-pop z-50 text-amber-400">
              {toast}
            </div>
          )}
          <Grid 
            guesses={state.guesses} 
            currentGuess={state.currentGuess} 
            targetWord={state.targetWord} 
            wordLength={settings.wordLength}
            maxGuesses={settings.maxGuesses}
          />
        </main>

        {state.isGameOver && (
          <div className="text-center mb-4 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-slate-900/80 border border-white/5 rounded-3xl p-6 backdrop-blur-sm shadow-xl">
              <p className="text-sm uppercase font-black text-slate-500 tracking-widest mb-1">
                {state.isGameWon ? 'Vítězství!' : 'Příště to vyjde'}
              </p>
              <h2 className={`text-4xl font-black mb-4 ${state.isGameWon ? 'text-sky-400' : 'text-rose-500'}`}>
                {state.targetWord}
              </h2>
              
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <a 
                  href={`https://cs.wiktionary.org/wiki/${state.targetWord.toLowerCase()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold text-slate-300 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  Co to znamená?
                </a>
                <button 
                  onClick={() => {
                    const reported = JSON.parse(localStorage.getItem('wordle-reported-words') || '[]');
                    if (!reported.includes(state.targetWord)) {
                      localStorage.setItem('wordle-reported-words', JSON.stringify([...reported, state.targetWord]));
                      alert('Slovo nahlášeno. Při dalším čištění slovníku bude odstraněno.');
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 transition-all flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  Nahlásit chybu
                </button>
              </div>

              <button 
                onClick={() => {
                  localStorage.removeItem(STATE_KEY);
                  window.location.reload();
                }}
                className="w-full py-4 bg-gradient-to-r from-sky-500 to-violet-500 rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-sky-500/25 text-white"
              >
                Hrát znovu
              </button>
            </div>
          </div>
        )}

        <Keyboard 
          onKeyPress={(key) => handleKeyup(key)} 
          guesses={state.guesses} 
          targetWord={state.targetWord} 
        />
      </div>
    </>
  );
}

export default function App() {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved settings", e);
      }
    }
    return {
      wordLength: DEFAULT_WORD_LENGTH,
      maxGuesses: DEFAULT_MAX_GUESSES
    };
  });

  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [validWords, setValidWords] = useState<Set<string>>(new Set());
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const initGame = useCallback(async (currentSettings: GameSettings) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/czech-${currentSettings.wordLength}-letter-words.json`);
      const data = await res.json();
      
      const wordsArray = data.map((w: string) => w.toUpperCase());
      
      if (wordsArray.length === 0) {
        throw new Error(`Žádná slova o délce ${currentSettings.wordLength} nenalezena.`);
      }

      setValidWords(new Set(wordsArray));
      const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
      setTargetWord(randomWord);
    } catch (err) {
      console.error("Nepodařilo se načíst slovník:", err);
      if (currentSettings.wordLength === 5) {
        setTargetWord('PRAHA');
      } else {
        setTargetWord('TEST'.padEnd(currentSettings.wordLength, 'X'));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isGameStarted) {
      initGame(settings);
    }
  }, [initGame, settings, isGameStarted]);

  const handleStartGame = (newSettings: GameSettings) => {
    setSettings(newSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(newSettings));
    
    // Pokud měníme nastavení, resetujeme stav hry
    const savedState = localStorage.getItem(STATE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      if (parsed.settings?.wordLength !== newSettings.wordLength || parsed.settings?.maxGuesses !== newSettings.maxGuesses) {
        localStorage.removeItem(STATE_KEY);
      }
    }
    
    setIsGameStarted(true);
  };

  if (!isGameStarted) {
    return <SetupScreen settings={settings} onStart={handleStartGame} />;
  }

  if (isLoading || !targetWord) {
    return <div className="flex items-center justify-center min-h-screen text-2xl font-bold bg-slate-950 text-white">Načítám...</div>;
  }

  return (
    <Game 
      targetWord={targetWord} 
      validWords={validWords} 
      settings={settings}
      onOpenSetup={() => setIsGameStarted(false)}
    />
  );
}
