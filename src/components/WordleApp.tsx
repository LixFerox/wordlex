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

export function WordleApp() {
  const [words, setWords] = useState<string[]>([]);
  const [wordSelected, setWordSelected] = useState<string>("");
  const [currentRow, setCurrentRow] = useState<number>(0);
  const [currentCol, setCurrentCol] = useState<number>(0);
  const [letters, setLetters] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );
  const [colors, setColors] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(5).fill(""))
  );
  const [keyColors, setKeyColors] = useState<Record<string, string>>({});
  const [solvedRow, setSolvedRow] = useState<number | null>(null);
  const [animatingRow, setAnimatingRow] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showInvalidWord, setShowInvalidWord] = useState(false);

  useEffect(() => {
    const lista = getListOfWords();
    const palabra = getCurrentWord();
    setWords(lista);
    setWordSelected(palabra);
  }, []);

  const restartGame = () => {
    generateWord();
    resetWord();
    const nueva = getCurrentWord();
    setWordSelected(nueva);
  };

  useEffect(() => {
    setCurrentRow(0);
    setCurrentCol(0);
    setLetters(Array.from({ length: 6 }, () => Array(5).fill("")));
    setColors(Array.from({ length: 6 }, () => Array(5).fill("")));
    setKeyColors({});
    setSolvedRow(null);
  }, [wordSelected]);

  const handleKeyPress = useCallback(
    (key: string) => {
      if (currentRow >= 6) return;

      if (/^[a-zñ]$/.test(key)) {
        if (currentCol < 5) {
          setLetters((prev) => {
            const copia = prev.map((fila) => fila.slice());
            copia[currentRow][currentCol] = key.toUpperCase();
            return copia;
          });
          setCurrentCol((c) => c + 1);
        }
        return;
      }

      if (key === "del") {
        if (currentCol > 0) {
          setCurrentCol((c) => c - 1);
          setLetters((prev) => {
            const copia = prev.map((fila) => fila.slice());
            copia[currentRow][currentCol - 1] = "";
            return copia;
          });
        }
        return;
      }

      if (key === "ent") {
        if (currentCol === 5) {
          const guess = letters[currentRow].join("").toLowerCase();
          if (words.includes(guess)) {
            const newColors = Array(5).fill("gray");
            const wordArr = wordSelected.split("");
            const used = Array(5).fill(false);

            for (let i = 0; i < 5; i++) {
              if (guess[i] === wordArr[i]) {
                newColors[i] = "green";
                used[i] = true;
              }
            }

            for (let i = 0; i < 5; i++) {
              if (newColors[i] !== "green") {
                const index = wordArr.findIndex(
                  (char, j) => char === guess[i] && !used[j]
                );
                if (index !== -1) {
                  newColors[i] = "orange";
                  used[index] = true;
                } else {
                  newColors[i] = "red";
                }
              }
            }

            setAnimatingRow(currentRow);

            const priority = {
              green: 3,
              orange: 2,
              red: 1,
              gray: 0,
            } as const;

            type ColorKey = keyof typeof priority;

            newColors.forEach((color, i) => {
              setTimeout(() => {
                const letter = letters[currentRow][i];

                setColors((prev) => {
                  const copia = prev.map((fila) => fila.slice());
                  copia[currentRow][i] = color;
                  return copia;
                });

                setKeyColors((prev) => {
                  const existing = prev[letter];
                  if (
                    !existing ||
                    priority[color as ColorKey] > priority[existing as ColorKey]
                  ) {
                    return { ...prev, [letter]: color };
                  }
                  return prev;
                });
              }, i * 200);
            });

            const totalDelay = newColors.length * 200;

            setTimeout(() => {
              setAnimatingRow(null);

              if (guess === wordSelected) {
                setSolvedRow(currentRow);
                setTimeout(() => {
                  setShowModal(true);
                }, 800);
              } else if (currentRow === 5) {
                setTimeout(() => {
                  setShowModal(true);
                }, 800);
              } else {
                setCurrentRow((r) => r + 1);
                setCurrentCol(0);
              }
            }, totalDelay + 400);
          } else {
            setShowInvalidWord(true);
            setTimeout(() => setShowInvalidWord(false), 1400);
          }
        }
        return;
      }
    },
    [currentRow, currentCol, letters, words, wordSelected]
  );

  useEffect(() => {
    const downHandler = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (k === "backspace") {
        e.preventDefault();
        handleKeyPress("del");
        return;
      }
      if (k === "enter") {
        e.preventDefault();
        handleKeyPress("ent");
        return;
      }
      if (/^[a-zñ]$/.test(k)) {
        e.preventDefault();
        handleKeyPress(k);
      }
    };
    window.addEventListener("keydown", downHandler);
    return () => {
      window.removeEventListener("keydown", downHandler);
    };
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
          message={solvedRow !== null ? `ACERT` : `${wordSelected}`}
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
