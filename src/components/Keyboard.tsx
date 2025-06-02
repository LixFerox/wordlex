import { Icon } from "@iconify/react";

const keys = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ñ"],
  ["ent", "z", "x", "c", "v", "b", "n", "m", "del"],
];

interface KeyboardProps {
  onPressKey: (key: string) => void;
  keyColors: Record<string, string>;
}

export function Keyboard({ onPressKey, keyColors }: KeyboardProps) {
  return (
    <div className="flex flex-col w-full">
      {keys.map((row, index) => (
        <div
          key={index}
          className={`grid gap-1 mb-1.5 items-stretch text-center font-bold 
            ${row.length === 10 ? "grid-cols-10" : "grid-cols-9"}`}
        >
          {row.map((key) => {
            const color = keyColors[key.toUpperCase()];
            const colorClass =
              color === "green"
                ? "bg-correct"
                : color === "orange"
                ? "bg-present"
                : color === "red"
                ? "bg-absent/20"
                : "bg-key-default";

            return (
              <button
                key={key}
                onClick={() => onPressKey(key)}
                className={`flex flex-col items-center justify-center py-5 rounded-md uppercase cursor-pointer ${colorClass} hover:brightness-150 transition-all ease-in-out duration-150`}
              >
                {key === "ent" ? (
                  <Icon icon="mdi:check" className="text-xl" />
                ) : key === "del" ? (
                  <Icon icon="mdi:backspace-outline" className="text-xl" />
                ) : (
                  <span>{key}</span>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
