"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw } from "lucide-react";
import PlayerCard from "./PlayerCard";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [showInputs, setShowInputs] = useState(false);
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("😀");
  const [players, setPlayers] = useState<
    { name: string; emoji: string; lives: number }[]
  >([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPlayer = () => {
    if (!name.trim()) return;
    setPlayers((prev) => [...prev, { name, emoji, lives: 5 }]);
    setName("");
  };

  const handleClickCard = (index: number) => {
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === index && p.lives > 0 ? { ...p, lives: p.lives - 1 } : p
      )
    );
  };

  const handleDeletePlayer = (index: number) => {
    setPlayers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirmResetLives = () => {
    setPlayers((prev) => prev.map((player) => ({ ...player, lives: 5 })));
    setShowResetConfirm(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center space-y-4">
      <AnimatePresence
        onExitComplete={() => {
          setShowInputs(true);
        }}
      >
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="text-center mt-32"
          >
            <h1 className="text-4xl font-bold mb-2">
              Bem-vindo ao Jogo FODINHA
            </h1>
            <p className="text-lg text-zinc-400">Alguém vai mamar!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {showInputs && (
        <>
          <div className="w-full max-w-xs space-y-2">
            <Input
              className="bg-zinc-900 text-white border-zinc-700"
              placeholder="Nome do participante"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              className="bg-zinc-900 text-white border-zinc-700"
              placeholder="Emoji (ex: 😎)"
              value={emoji}
              onChange={(e) => setEmoji(e.target.value)}
              maxLength={2}
            />
            <Button className="w-full" onClick={handleAddPlayer}>
              Adicionar
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4 w-full max-w-md mt-4">
            <AnimatePresence>
              {players.map((player, index) => (
                <PlayerCard
                  key={player.name + index}
                  player={player}
                  onClick={() => handleClickCard(index)}
                  onDelete={() => handleDeletePlayer(index)}
                  onResetLives={handleConfirmResetLives}
                />
              ))}
            </AnimatePresence>
          </div>

          <Button
            onClick={() => setShowResetConfirm(true)}
            className="fixed bottom-6 right-6 rounded-full p-4 bg-zinc-700 hover:bg-zinc-600 text-white shadow-lg z-20"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </>
      )}

      <div className="mt-auto py-4">
        <p className="text-sm text-zinc-500 text-center">
          by{" "}
          <a
            href="http://instagram.com/arthur_vassoler_"
            className="font-semibold text-white hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Arthur Vassoler
          </a>{" "}
          💜
        </p>
      </div>

      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-80 z-30 flex flex-col items-center justify-center p-4 text-center"
          >
            <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg max-w-sm w-full">
              <p className="text-white text-sm mb-4">
                Tem certeza que deseja{" "}
                <span className="font-bold text-red-400">
                  resetar as vidas
                </span>{" "}
                de todos os jogadores? 🔁
              </p>
              <div className="flex justify-center gap-4">
                <Button
                  onClick={() => setShowResetConfirm(false)}
                  className="bg-zinc-600 hover:bg-zinc-500"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmResetLives}
                  className="bg-red-600 hover:bg-red-500"
                >
                  Resetar Vidas
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
