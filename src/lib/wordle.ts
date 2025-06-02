import dictionary from "~/assets/dictionary.txt?raw";

const words = dictionary.split("\n");

var currentWord: string | null = null;

function getListOfWords(): string[] {
  if (words.length === 0) {
    throw new Error("No words available in the dictionary.");
  }
  return words.map((word) => word.trim()).filter((word) => word.length > 0);
}

function getCurrentWord(): string {
  if (!currentWord) {
    generateWord();
  }
  return currentWord!;
}
function generateWord(): string {
  currentWord = words[Math.floor(Math.random() * words.length)];
  return currentWord;
}

function resetWord(): void {
  currentWord = null;
}

export { getListOfWords, getCurrentWord, generateWord, resetWord };
