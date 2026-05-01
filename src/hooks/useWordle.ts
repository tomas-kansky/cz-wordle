import { useState, useEffect, useCallback } from 'react';
import type { GameState } from '../types';
import { MAX_GUESSES, WORD_LENGTH } from '../types';

// Klíč pro localStorage
const STORAGE_KEY = 'wordle-state';

export function useWordle(targetWord: string, validWords: Set<string>) {
  const [toast, setToast] = useState<string | null>(null);

  const [state, setState] = useState<GameState>(() => {
    // Pokus o načtení z localStorage
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.targetWord === targetWord) {
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
    };
  });

  // Ukládání do localStorage při změně stavu
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Pomocná metoda pro validaci
  const isValidWord = (word: string) => {
    if (validWords.size === 0) return word.length === WORD_LENGTH;
    return validWords.has(word);
  };

  const handleKeyup = useCallback((key: string) => {
    if (state.isGameOver) return;

    if (key === 'Enter') {
      if (state.currentGuess.length !== WORD_LENGTH) {
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
        const isOver = isWon || newGuesses.length >= MAX_GUESSES;

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

    if (/^[a-zA-Z]$/.test(key)) {
      if (state.currentGuess.length < WORD_LENGTH) {
        setState((prev) => ({
          ...prev,
          currentGuess: prev.currentGuess + key.toUpperCase(),
        }));
      }
    }
  }, [state]);

  // Posluchač pro klávesnici
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => handleKeyup(e.key);
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyup]);

  return { state, handleKeyup, toast };
}
