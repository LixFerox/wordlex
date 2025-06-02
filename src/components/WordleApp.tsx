import { useState, useEffect, useCallback } from "react";
import { Board } from "./Board";
import { Keyboard } from "./Keyboard";
import { Modal } from "./Modal";
import {
  getListOfWords,
  getCurrentWord,
  generateWord,
  resetWord,
} from "~/lib/wordle.ts";

const EMPTY_6x5 = () => Array.from({ length: 6 }, () => Array(5).fill(""));

const COLOR_PRIORITY = {
  green: 3,
  orange: 2,
  red: 1,
  gray: 0,
} as const;

type Color = keyof typeof COLOR_PRIORITY;

export function WordleApp() {
  const [words, setWords] = useState<string[]>([]);
  const [wordSelected, setWordSelected] = useState<string>("");
  const [letters, setLetters] = useState<string[][]>(EMPTY_6x5);
  const [colors, setColors] = useState<string[][]>(EMPTY_6x5);
  const [keyColors, setKeyColors] = useState<Record<string, string>>({});
  const [currentRow, setCurrentRow] = useState(0);
  const [currentCol, setCurrentCol] = useState(0);
  const [solvedRow, setSolvedRow] = useState<number | null>(null);
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvalidWord, setShowInvalidWord] = useState(false);

  useEffect(() => {
    setWords(getListOfWords());
    setWordSelected(getCurrentWord());
  }, []);

  const resetBoard = () => {
    setLetters(EMPTY_6x5);
    setColors(EMPTY_6x5);
    setKeyColors({});
    setCurrentRow(0);
    setCurrentCol(0);
    setSolvedRow(null);
  };

  const restartGame = () => {
    generateWord();
    resetWord();
    setWordSelected(getCurrentWord());
  };

  useEffect(resetBoard, [wordSelected]);

  const updateColors = (guess: string, word: string) => {
    const result = Array(5).fill("gray");
    const used = Array(5).fill(false);
    const wordArr = word.split("");

    for (let i = 0; i < 5; i++) {
      if (guess[i] === wordArr[i]) {
        result[i] = "green";
        used[i] = true;
      }
    }

    for (let i = 0; i < 5; i++) {
      if (result[i] !== "green") {
        const idx = wordArr.findIndex((c, j) => c === guess[i] && !used[j]);
        result[i] = idx !== -1 ? "orange" : "red";
        if (idx !== -1) used[idx] = true;
      }
    }

    return result;
  };

  const updateKeyColors = (letter: string, color: string) => {
    setKeyColors((prev) => {
      const existing = prev[letter];
      if (
        !existing ||
        COLOR_PRIORITY[color as Color] > COLOR_PRIORITY[existing as Color]
      ) {
        return { ...prev, [letter]: color };
      }
      return prev;
    });
  };

  const handleKeyPress = useCallback(
    (key: string) => {
      if (currentRow >= 6) return;

      if (/^[a-zñ]$/.test(key)) {
        if (currentCol < 5) {
          setLetters((prev) => {
            const copy = prev.map((row) => [...row]);
            copy[currentRow][currentCol] = key.toUpperCase();
            return copy;
          });
          setCurrentCol((c) => c + 1);
        }
        return;
      }

      if (key === "del" && currentCol > 0) {
        setCurrentCol((c) => c - 1);
        setLetters((prev) => {
          const copy = prev.map((row) => [...row]);
          copy[currentRow][currentCol - 1] = "";
          return copy;
        });
        return;
      }

      if (key === "ent" && currentCol === 5) {
        const guess = letters[currentRow].join("").toLowerCase();

        if (!words.includes(guess)) {
          setShowInvalidWord(true);
          setTimeout(() => setShowInvalidWord(false), 1400);
          return;
        }

        const colorRow = updateColors(guess, wordSelected);
        setAnimatingRow(currentRow);

        colorRow.forEach((color, i) => {
          setTimeout(() => {
            setColors((prev) => {
              const copy = prev.map((row) => [...row]);
              copy[currentRow][i] = color;
              return copy;
            });

            updateKeyColors(letters[currentRow][i], color);
          }, i * 200);
        });

        const delay = colorRow.length * 200;

        setTimeout(() => {
          setAnimatingRow(null);
          if (guess === wordSelected) {
            setSolvedRow(currentRow);
            setTimeout(() => setShowModal(true), 800);
          } else if (currentRow === 5) {
            setTimeout(() => setShowModal(true), 800);
          } else {
            setCurrentRow((r) => r + 1);
            setCurrentCol(0);
          }
        }, delay + 400);
      }
    },
    [currentRow, currentCol, letters, words, wordSelected]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      e.preventDefault();
      if (k === "backspace") return handleKeyPress("del");
      if (k === "enter") return handleKeyPress("ent");
      if (/^[a-zñ]$/.test(k)) return handleKeyPress(k);
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKeyPress]);

  return (
    <>
      <main>
        <div className="max-w-xl h-full mx-auto flex justify-center items-center my-2 gap-4 text-center">
          <Board
            letters={letters}
            colors={colors}
            solvedRow={solvedRow}
            animatingRow={animatingRow}
          />
        </div>
      </main>
      <footer>
        <div className="max-w-xl mx-auto flex justify-between items-center gap-4 text-center">
          <Keyboard onPressKey={handleKeyPress} keyColors={keyColors} />
        </div>
      </footer>

      {showModal && (
        <Modal
          onRestart={() => {
            setShowModal(false);
            restartGame();
          }}
          message={
            solvedRow !== null
              ? "¡ACERTASTE!"
              : `La palabra era: ${wordSelected.toUpperCase()}`
          }
        />
      )}

      {showInvalidWord && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-absent  text-text px-4 py-2 rounded shadow-lg animate-fade-in z-50">
          Palabra no válida
        </div>
      )}
    </>
  );
}
