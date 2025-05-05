'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('😀');
  const [players, setPlayers] = useState<{ name: string; emoji: string; lives: number }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddPlayer = () => {
    if (!name.trim()) return;
    setPlayers([...players, { name, emoji, lives: 5 }]);
    setName('');
  };

  const handleClickCard = (index: number) => {
    setPlayers((prev) =>
      prev.map((p, i) =>
        i === index && p.lives > 0 ? { ...p, lives: p.lives - 1 } : p
      )
    );
  };

  const handleResetLives = () => {
    setPlayers((prev) =>
      prev.map((player) => ({ ...player, lives: 5 }))
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center space-y-4">
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, y: -80 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
            className="text-center mt-32"
          >
            <h1 className="text-4xl font-bold mb-2">Bem-vindo ao Jogo FODINHA</h1>
            <p className="text-lg text-zinc-400">Alguém vai mamar!</p>
          </motion.div>
        )}
      </AnimatePresence>

      {!showWelcome && (
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

          <div className="w-full grid grid-cols-1 gap-4 pt-6">
            {players.map((player, index) => (
              <Card
                key={index}
                onClick={() => handleClickCard(index)}
                className={`transition-all cursor-pointer ${
                  player.lives === 0
                    ? 'bg-red-900 border-red-700 opacity-70'
                    : 'bg-zinc-800 hover:bg-zinc-700'
                }`}
              >
                <CardContent className="flex items-center justify-between py-4 px-6">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{player.emoji}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-200">{player.name}</span>
                      <div className="flex gap-1 pt-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < player.lives ? '❤️' : '🖤'}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button
            onClick={handleResetLives}
            className="fixed bottom-6 right-6 rounded-full p-4 bg-zinc-700 hover:bg-zinc-600 text-white shadow-lg"
          >
            <RotateCcw className="w-5 h-5" />
          </Button>
        </>
      )}
    </div>
  );
}
