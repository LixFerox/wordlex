import { useState } from "react";
import { Icon } from "@iconify/react";

interface EndModalProps {
  message: string;
  onRestart: () => void;
  puntuation: number;
}

export function Modal({ message, onRestart, puntuation }: EndModalProps) {
  const [isSubmitted, setIsSubmitted] = useState(false);

  async function handleRegisterSubmit(
    e: React.FormEvent<HTMLFormElement>,
    puntuation: number
  ) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username")?.toString() || "";

    setIsSubmitted(true);

    await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, puntuation }),
    });

    setTimeout(() => {
      setIsSubmitted(false);
      onRestart();
    }, 1200);
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1e1f22] rounded-lg p-6 shadow-lg text-center animate-fade-in">
          <h2 className="text-xl font-bold mb-4">
            {message === "¡ACERTASTE!" ? "¡Felicidades!" : "Juego Terminado"}
          </h2>
          <p className="mb-4 italic text-gray-400">
            {message === "¡ACERTASTE!"
              ? "¡Has acertado!"
              : `Lo siento, la palabra era "${message}".`}
          </p>
          {message === "¡ACERTASTE!" ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-4 p-4 rounded-lg shadow-md bg-[#2e2f33] text-text">
                <p className="text-lg font-semibold">Registrar puntuación</p>
                <form
                  onSubmit={(e) => handleRegisterSubmit(e, puntuation)}
                  className="flex flex-col items-center gap-3 w-full"
                >
                  <input
                    type="text"
                    name="username"
                    placeholder="Tu nombre"
                    required
                    className="w-full max-w-xs px-4 py-2 rounded-md bg-[#1e1f22]  placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 cursor-pointer rounded-lg hover:brightness-150 transition-all ease-in-out duration-200 bg-key-default"
                  >
                    {isSubmitted ? (
                      <div className="animate-spin">
                        <Icon icon="mdi:loading" className="size-6" />
                      </div>
                    ) : (
                      "Enviar"
                    )}
                  </button>
                </form>
              </div>
              <button
                onClick={onRestart}
                className="px-4 py-2 cursor-pointer rounded-lg hover:brightness-150 transition-all ease-in-out duration-200 bg-key-default text-text"
              >
                Volver a jugar
              </button>
            </div>
          ) : (
            <button
              onClick={onRestart}
              className="px-4 py-2 cursor-pointer rounded-lg hover:brightness-150 transition-all ease-in-out duration-200 bg-key-default text-text"
            >
              Volver a jugar
            </button>
          )}
        </div>
      </div>
    </>
  );
}
