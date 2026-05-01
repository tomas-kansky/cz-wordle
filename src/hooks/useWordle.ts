import { useState, useEffect, useCallback } from 'react';
import type { GameState, GameSettings } from '../types';

// Klíč pro localStorage
const STORAGE_KEY = 'wordle-state';

export function useWordle(targetWord: string, validWords: Set<string>, settings: GameSettings) {
  const [toast, setToast] = useState<string | null>(null);

  const [state, setState] = useState<GameState>(() => {
    // Pokus o načtení z localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Respektujeme starý stav jen pokud souhlasí hledané slovo a nastavení
        if (
          parsed.targetWord === targetWord &&
          parsed.settings?.wordLength === settings.wordLength &&
          parsed.settings?.maxGuesses === settings.maxGuesses
        ) {
          return parsed;
        }
      } catch (e) {
        console.error("Error parsing saved state", e);
      }
    }
    
    return {
      guesses: [],
      currentGuess: '',
      isGameOver: false,
      isGameWon: false,
      targetWord: targetWord,
      settings: settings,
    };
  });

  // Ukládání do localStorage při změně stavu
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Pokud se změní targetWord nebo nastavení zvenčí a neodpovídá stavu, resetujeme
  useEffect(() => {
    if (
      state.targetWord !== targetWord ||
      state.settings.wordLength !== settings.wordLength ||
      state.settings.maxGuesses !== settings.maxGuesses
    ) {
      setState({
        guesses: [],
        currentGuess: '',
        isGameOver: false,
        isGameWon: false,
        targetWord: targetWord,
        settings: settings,
      });
    }
  }, [targetWord, settings, state.targetWord, state.settings]);

  // Pomocná metoda pro validaci
  const isValidWord = (word: string) => {
    if (validWords.size === 0) return word.length === settings.wordLength;
    return validWords.has(word);
  };

  const handleKeyup = useCallback((key: string) => {
    if (state.isGameOver) return;

    if (key === 'Enter') {
      if (state.currentGuess.length !== settings.wordLength) {
        setToast("Příliš krátké slovo");
        setTimeout(() => setToast(null), 2000);
        return;
      }
      if (!isValidWord(state.currentGuess)) {
        setToast("Tohle slovo neznám");
        setTimeout(() => setToast(null), 2000);
        return;
      }

      setState((prev) => {
        const isWon = prev.currentGuess === prev.targetWord;
        const newGuesses = [...prev.guesses, prev.currentGuess];
        const isOver = isWon || newGuesses.length >= settings.maxGuesses;

        return {
          ...prev,
          guesses: newGuesses,
          currentGuess: '',
          isGameWon: isWon,
          isGameOver: isOver,
        };
      });
      return;
    }

    if (key === 'Backspace') {
      setState((prev) => ({
        ...prev,
        currentGuess: prev.currentGuess.slice(0, -1),
      }));
      return;
    }

    if (/^[a-zA-ZěščřžýáíéúůóďťňĚŠČŘŽÝÁÍÉÚŮÓĎŤŇ]$/i.test(key)) {
      if (state.currentGuess.length < settings.wordLength) {
        // Povolujeme diakritiku, zjednodušení na velká písmena
        // U skutečné hry s českými slovy je třeba nahradit diakritiku (např. normalize)
        // nebo zajistit, aby target word neměl diakritiku.
        // Prozatím ponecháváme existující chování
        setState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess + key.toUpperCase(),
        }));
      }
    }
  }, [state, settings, isValidWord, targetWord]);

  // Posluchač pro klávesnici
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorujeme, pokud uživatel drží Ctrl, Alt, Meta (aby fungovaly zkratky jako obnova stránky atd.)
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      handleKeyup(e.key);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyup]);

  return { state, handleKeyup, toast };
}
