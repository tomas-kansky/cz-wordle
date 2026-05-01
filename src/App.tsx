import { useWordle } from './hooks/useWordle';
import { Grid } from './components/Grid';
import { Keyboard } from './components/Keyboard';
import { useEffect, useState } from 'react';

function Game({ targetWord, validWords }: { targetWord: string; validWords: Set<string> }) {
  const { state, handleKeyup, toast } = useWordle(targetWord, validWords);

  return (
    <>
      <div className="background-animation absolute top-[-50%] left-[-50%] w-[200%] h-[200%] pointer-events-none z-0
                      bg-[radial-gradient(circle_at_50%_50%,rgba(56,189,248,0.08),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_40%)] 
                      animate-[rotateBg_30s_linear_infinite]">
      </div>

      <div className="app-container mx-auto w-full max-w-[500px] h-[100dvh] flex flex-col relative z-10 px-2 sm:px-4 py-2 sm:py-4">
        <header className="flex justify-center items-center py-4 border-b border-white/10 mb-8">
          <h1 className="text-4xl font-extrabold tracking-widest bg-gradient-to-r from-sky-400 to-violet-500 text-transparent bg-clip-text drop-shadow-[0_4px_20px_rgba(56,189,248,0.3)]">
            WORDLE
          </h1>
        </header>

        <main className="game-board flex justify-center items-center grow relative">
          {toast && (
            <div className="absolute top-[-10px] px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg font-bold shadow-lg animate-pop z-50 text-amber-400">
              {toast}
            </div>
          )}
          <Grid 
            guesses={state.guesses} 
            currentGuess={state.currentGuess} 
            targetWord={state.targetWord} 
          />
        </main>

        {state.isGameOver && (
          <div className="text-center mb-4">
            <p className="text-xl font-bold">
              {state.isGameWon ? 'Gratuluji, uhádl jsi!' : `Konec hry. Hledané slovo bylo: ${state.targetWord}`}
            </p>
            <button 
              onClick={() => {
                localStorage.removeItem('wordle-state');
                window.location.reload();
              }}
              className="mt-2 px-4 py-2 bg-sky-500 rounded font-bold hover:bg-sky-600 transition"
            >
              Hrát znovu
            </button>
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
  const [targetWord, setTargetWord] = useState<string | null>(null);
  const [validWords, setValidWords] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch('/czech-words.json')
      .then(res => res.json())
      .then(data => {
        const wordsArray = data.map((w: string) => w.toUpperCase());
        setValidWords(new Set(wordsArray));
        
        // Zvolíme náhodné slovo
        const randomWord = wordsArray[Math.floor(Math.random() * wordsArray.length)];
        setTargetWord(randomWord);
      })
      .catch((err) => {
        console.error("Nepodařilo se načíst slovník:", err);
        // Fallback
        setTargetWord('PRAHA');
      });
  }, []);

  if (!targetWord || validWords.size === 0) {
    return <div className="flex items-center justify-center min-h-screen text-2xl font-bold">Načítám...</div>;
  }

  return <Game targetWord={targetWord} validWords={validWords} />;
}
