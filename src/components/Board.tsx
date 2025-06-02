export function Board({
  letters,
  colors,
  solvedRow,
  animatingRow,
}: {
  letters: string[][];
  colors: string[][];
  solvedRow: number | null;
  animatingRow: number | null;
}) {
  return (
    <>
      <div className="flex flex-col w-full lg:max-w-xs max-w-2xs mx-auto ">
        {letters.map((row, indexRow) => (
          <div
            key={indexRow}
            className="grid grid-cols-5 gap-1 mb-1.5 items-stretch text-center font-bold"
          >
            {row.map((cell, indexCell) => {
              const color = colors[indexRow][indexCell];
              const isAnimating = animatingRow === indexRow;
              const animationDelay = `${indexCell * 0.2}s`;
              const animationTextDelay = `${indexCell * 0.2 + 0.2}s`;
              return (
                <div
                  key={`${indexRow}-${indexCell}`}
                  style={isAnimating ? { animationDelay } : {}}
                  className={`max-w-15 max-h-15 flex flex-col items-center justify-center aspect-square rounded-md uppercase cursor-pointer border-2 border-gray-200/20 ${
                    color === "green" && "bg-correct"
                  } ${color === "orange" && "bg-present"} ${
                    color === "red" && "bg-absent"
                  } ${isAnimating ? "animate-flip-y" : ""} ${
                    animatingRow === indexRow ? "" : ""
                  }`}
                >
                  <p
                    style={
                      isAnimating ? { animationDelay: animationTextDelay } : {}
                    }
                    className={`${
                      animatingRow === indexRow ? "animate-fade-in" : ""
                    }`}
                  >
                    {cell}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
