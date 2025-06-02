interface EndModalProps {
  message: string;
  onRestart: () => void;
}

export function Modal({ message, onRestart }: EndModalProps) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1e1f22] rounded-lg p-6 shadow-lg text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            {message === "¡ACERTASTE!" ? "¡Felicidades!" : "Juego Terminado"}
          </h2>
          <p className="mb-4">
            {message === "¡ACERTASTE!"
              ? "¡Has acertado!"
              : `Lo siento, la palabra era "${message}".`}
          </p>
          <button
            onClick={onRestart}
            className="px-4 py-2 cursor-pointer rounded-lg hover:brightness-150 transition-all ease-in-out duration-200 bg-key-default text-text"
          >
            Volver a jugar
          </button>
        </div>
      </div>
    </>
  );
}
