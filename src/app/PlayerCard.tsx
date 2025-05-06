"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type PlayerCardProps = {
  player: { name: string; emoji: string; lives: number };
  onClick: () => void;
  onDelete: () => void;
  onResetLives: () => void;
};

export default function PlayerCard({
  player,
  onClick,
  onDelete,
}: PlayerCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showMamou, setShowMamou] = useState(false);
  const [showExplosion, setShowExplosion] = useState(false);
  const [previousLives, setPreviousLives] = useState(player.lives);
  const [explosionDismissed, setExplosionDismissed] = useState(false);

  useEffect(() => {
    if (!explosionDismissed && previousLives > 0 && player.lives === 0) {
      setShowExplosion(true);
      const timer = setTimeout(() => {
        setShowExplosion(false);
        setExplosionDismissed(true);
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (player.lives > 0) {
      setExplosionDismissed(false);
      setShowExplosion(false);
    }

    setPreviousLives(player.lives);
  }, [player.lives, previousLives, explosionDismissed]);

  const handleClick = () => {
    if (!showConfirm && player.lives > 0) {
      setShowMamou(true);
      onClick();
      setTimeout(() => setShowMamou(false), 1200);
    }
  };

  const handleDelete = () => {
    setShowConfirm(false);
    onDelete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="w-full max-w-md relative"
    >
      <AnimatePresence>
        {showExplosion && (
          <motion.div
            key="explosion"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white px-6 py-2 rounded-full shadow-xl text-lg font-semibold z-30"
          >
            💥 {player.name} mamou todas as vidas! 💀
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showMamou && (
          <motion.div
            key="mamou"
            initial={{ opacity: 0, y: 0, scale: 0.9 }}
            animate={{ opacity: 1, y: -40, scale: 1 }}
            exit={{ opacity: 0, y: -60, scale: 0.8 }}
            transition={{ duration: 0.8 }}
            className="absolute -top-2 left-1/2 -translate-x-1/2 bg-red-600 text-white px-3 py-1 rounded-full shadow-lg text-sm font-semibold z-20"
          >
            Você mamou, {player.name}! 💀
          </motion.div>
        )}
      </AnimatePresence>

      <Card
        onClick={handleClick}
        className={`cursor-pointer shadow-xl border-2 transition-all rounded-2xl w-full ${
          player.lives === 0
            ? "bg-red-900 border-red-700 opacity-60"
            : "bg-gradient-to-br from-zinc-800 to-zinc-700 border-zinc-600 hover:from-zinc-700 hover:to-zinc-600"
        }`}
      >
        <CardContent className="flex items-center justify-between py-4 px-6">
          <div className="flex items-center gap-4">
            <span className="text-4xl">{player.emoji}</span>
            <div className="flex flex-col">
              <span className="font-semibold text-lg">{player.name}</span>
              <div className="flex gap-1 pt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < player.lives ? "❤️" : "🖤"}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="hover:scale-110 transition-transform"
          >
            <Trash2 className="text-red-500 w-5 h-5" />
          </button>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 bg-black bg-opacity-80 rounded-2xl flex flex-col items-center justify-center p-4 text-center"
          >
            <p className="text-white text-sm mb-4">
              Tem certeza que quer chutar{" "}
              <span className="font-bold">{player.name}</span> do jogo? 😬
            </p>
            <div className="flex gap-2">
              <Button
                onClick={() => setShowConfirm(false)}
                className="bg-zinc-700 hover:bg-zinc-600"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-500"
              >
                Remover mamador 😈
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
