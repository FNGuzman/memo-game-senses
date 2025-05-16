'use client';

import { useState, useEffect, useRef } from 'react';
import MemoryCard from './components/MemoryCard';
import { useRouter } from 'next/navigation';

const SENTIDOS = [
  { id: 1, image: '/assets/img/lavista2.png', name: 'Vista' },
  { id: 2, image: '/assets/img/audicion2.png', name: 'Audición' },
  { id: 3, image: '/assets/img/olfato2.png', name: 'Olfato' },
  { id: 4, image: '/assets/img/gusto2.png', name: 'Gusto' },
  { id: 5, image: '/assets/img/tacto2.png', name: 'Tacto' },
];

export default function Home() {
  const [cards, setCards] = useState<Array<{
    id: number;
    image: string;
    name: string;
    isFlipped: boolean;
    isMatched: boolean;
    uniqueId: number;
  }>>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [isPreview, setIsPreview] = useState(true);
  const [canInteract, setCanInteract] = useState(false);
  const flipAudio = useRef<HTMLAudioElement | null>(null);
  const checkAudio = useRef<HTMLAudioElement | null>(null);
  const errorAudio = useRef<HTMLAudioElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    startPreview();
  }, []);

  useEffect(() => {
    if (gameComplete) {
      setTimeout(() => {
        router.push('/conclusion');
      }, 2000);
    }
  }, [gameComplete, router]);

  const startPreview = () => {
    const duplicatedCards = [...SENTIDOS, ...SENTIDOS]
      .map((card, index) => ({ ...card, uniqueId: index, isFlipped: true, isMatched: false }))
      .sort(() => Math.random() - 0.5);
    setCards(duplicatedCards);
    setFlippedCards([]);
    setMoves(0);
    setGameComplete(false);
    setIsPreview(true);
    setCanInteract(false);
    setTimeout(() => {
      // Voltear todas las cartas
      setCards(prev => prev.map(card => ({ ...card, isFlipped: false })));
      setIsPreview(false);
      setTimeout(() => setCanInteract(true), 600); // Espera la animación de volteo
    }, 5000);
  };

  const initializeGame = () => {
    startPreview();
  };

  const playSound = (audioRef: React.RefObject<HTMLAudioElement | null>) => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
  };

  const handleCardClick = (index: number) => {
    if (!canInteract || flippedCards.length === 2 || cards[index].isMatched || cards[index].isFlipped) return;

    playSound(flipAudio);

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstIndex, secondIndex] = newFlippedCards;

      if (cards[firstIndex].id === cards[secondIndex].id) {
        setTimeout(() => {
          playSound(checkAudio);
          const matchedCards = [...cards];
          matchedCards[firstIndex].isMatched = true;
          matchedCards[secondIndex].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);

          if (matchedCards.every(card => card.isMatched)) {
            setGameComplete(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          playSound(errorAudio);
          const resetCards = [...cards];
          resetCards[firstIndex].isFlipped = false;
          resetCards[secondIndex].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="min-h-dvh w-full flex flex-col items-center justify-between bg-[#fbe3c6] p-0">
      {/* Audios ocultos */}
      <audio ref={flipAudio} src="/assets/sounds/flipcard.mp3" preload="auto" />
      <audio ref={checkAudio} src="/assets/sounds/check.mp3" preload="auto" />
      <audio ref={errorAudio} src="/assets/sounds/error.mp3" preload="auto" />
      <header className="w-full py-4 text-center">
        <h1 className="text-2xl font-bold text-[#b48c6e]">Memoria de los Sentidos</h1>
        <span className="block text-[#b48c6e] text-base mt-1">Movimientos: {moves}</span>
        <button
          onClick={initializeGame}
          className="mt-2 bg-[#e2bfae] text-[#7c5c3b] px-4 py-2 rounded-lg text-sm font-semibold shadow hover:bg-[#e6cdbb] transition-colors"
          disabled={isPreview}
        >
          Reiniciar
        </button>
      </header>

      {gameComplete && (
        <div className="text-center mb-2 p-2 bg-[#e2bfae] rounded-lg w-11/12 mx-auto">
          <p className="text-lg font-bold text-[#7c5c3b]">
            ¡Felicidades! Completaste el juego en {moves} movimientos
          </p>
        </div>
      )}

      <main className="flex-1 w-full flex items-center justify-center">
        {/* Flex responsivo: 5 filas de 2 en móvil, 2 filas de 5 en md+ */}
        <div className="flex flex-col gap-2 md:gap-4 lg:gap-10 w-full max-w-xs md:max-w-4xl mx-auto px-2 md:gap-y-8">
          {/* Móvil: 5 filas de 2 cartas */}
          <div className="block md:hidden">
            {[0, 1, 2, 3, 4].map(fila => (
              <div key={fila} className="flex flex-row justify-center gap-2 mb-2">
                {cards.slice(fila * 2, fila * 2 + 2).map((card, idx) => (
                  <MemoryCard
                    key={card.uniqueId}
                    image={card.image}
                    isFlipped={card.isFlipped}
                    isMatched={card.isMatched}
                    onClick={() => handleCardClick(fila * 2 + idx)}
                  />
                ))}
              </div>
            ))}
          </div>
          {/* Desktop/Tablet: 2 filas de 5 cartas */}
          <div className="hidden md:block">
            <div className="flex flex-row justify-center gap-4 lg:gap-10 mb-4">
              {cards.slice(0, 5).map((card, index) => (
                <MemoryCard
                  key={card.uniqueId}
                  image={card.image}
                  isFlipped={card.isFlipped}
                  isMatched={card.isMatched}
                  onClick={() => handleCardClick(index)}
                />
              ))}
            </div>
            <div className="flex flex-row justify-center gap-4 lg:gap-10">
              {cards.slice(5, 10).map((card, index) => (
                <MemoryCard
                  key={card.uniqueId}
                  image={card.image}
                  isFlipped={card.isFlipped}
                  isMatched={card.isMatched}
                  onClick={() => handleCardClick(index + 5)}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
