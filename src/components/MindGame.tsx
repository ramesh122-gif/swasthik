import { useState, useEffect } from 'react';
import { Brain, Trophy, Clock, Target, RotateCcw, Pause, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Card {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export default function MindGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [bestScore, setBestScore] = useState<{ best_time: number; best_moves: number; total_games: number } | null>(null);
  const [loading, setLoading] = useState(true);

  const symbols = ['🌸', '🌺', '🌻', '🌷', '🌹', '🌼', '🍀', '🌿'];

  useEffect(() => {
    loadBestScore();
    initializeGame();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && !isPaused && !gameComplete) {
      timer = setInterval(() => {
        setGameTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameStarted, isPaused, gameComplete]);

  useEffect(() => {
    if (matches === 8 && gameStarted) {
      handleGameComplete();
    }
  }, [matches, gameStarted]);

  const loadBestScore = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.rpc('get_best_game_score', {
        p_user_id: user.id,
        p_difficulty: 'normal'
      });

      if (!error && data && data.length > 0) {
        setBestScore(data[0]);
      }
    } catch (error) {
      console.error('Error loading best score:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeGame = () => {
    const shuffledSymbols = [...symbols, ...symbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledSymbols);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setGameTime(0);
    setGameStarted(false);
    setIsPaused(false);
    setGameComplete(false);
  };

  const handleCardClick = (cardId: number) => {
    if (!gameStarted) setGameStarted(true);
    if (isPaused || gameComplete) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length === 2) return;

    const newCards = cards.map((c) =>
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      checkForMatch(newFlippedCards);
    }
  };

  const checkForMatch = (flippedIds: number[]) => {
    const [firstId, secondId] = flippedIds;
    const firstCard = cards.find((c) => c.id === firstId);
    const secondCard = cards.find((c) => c.id === secondId);

    if (firstCard?.symbol === secondCard?.symbol) {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
      }, 500);
    } else {
      setTimeout(() => {
        setCards((prev) =>
          prev.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          )
        );
        setFlippedCards([]);
      }, 1000);
    }
  };

  const handleGameComplete = async () => {
    setGameComplete(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('mind_game_scores').insert({
        user_id: user.id,
        game_duration: gameTime,
        moves_count: moves,
        difficulty_level: 'normal',
      });

      await loadBestScore();
    } catch (error) {
      console.error('Error saving game score:', error);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Mind Wellness Game</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Relax and sharpen your focus with this memory game</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Moves</p>
              <p className="text-3xl font-bold mt-1">{moves}</p>
            </div>
            <Target className="w-12 h-12 text-teal-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Time</p>
              <p className="text-3xl font-bold mt-1">{formatTime(gameTime)}</p>
            </div>
            <Clock className="w-12 h-12 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Matches</p>
              <p className="text-3xl font-bold mt-1">{matches}/8</p>
            </div>
            <Brain className="w-12 h-12 text-amber-200" />
          </div>
        </div>
      </div>

      {!loading && bestScore && bestScore.total_games > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-4">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Your Best Performance</h2>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">{bestScore.best_moves}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Moves</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{formatTime(bestScore.best_time)}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Best Time</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{bestScore.total_games}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Games Played</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Game Board</h2>
          <div className="flex gap-2">
            {gameStarted && !gameComplete && (
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            )}
            <button
              onClick={initializeGame}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              New Game
            </button>
          </div>
        </div>

        {isPaused && (
          <div className="mb-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <p className="text-yellow-800 dark:text-yellow-200 text-center font-semibold">Game Paused</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto">
          {cards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              disabled={isPaused || gameComplete}
              className={`aspect-square rounded-xl text-5xl flex items-center justify-center transition-all duration-300 transform ${
                card.isFlipped || card.isMatched
                  ? 'bg-gradient-to-br from-teal-100 to-teal-200 dark:from-teal-800 dark:to-teal-700 scale-100'
                  : 'bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 hover:scale-105'
              } ${card.isMatched ? 'opacity-70' : ''} ${
                isPaused || gameComplete ? 'cursor-not-allowed' : 'cursor-pointer'
              } shadow-md hover:shadow-lg`}
            >
              {card.isFlipped || card.isMatched ? card.symbol : '❓'}
            </button>
          ))}
        </div>

        {gameComplete && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="text-center">
              <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-3" />
              <h3 className="text-2xl font-bold text-green-800 dark:text-green-200 mb-2">Congratulations!</h3>
              <p className="text-green-700 dark:text-green-300 mb-4">
                You completed the game in {moves} moves and {formatTime(gameTime)}
              </p>
              {bestScore && moves <= bestScore.best_moves && (
                <p className="text-green-600 dark:text-green-400 font-semibold">
                  New Personal Best!
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-xl shadow-md p-6 border border-teal-200 dark:border-teal-800">
        <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">How to Play</h3>
        <ul className="text-gray-700 dark:text-gray-300 text-sm space-y-1">
          <li>• Click on cards to flip them over and reveal symbols</li>
          <li>• Find matching pairs of symbols</li>
          <li>• Complete the game in as few moves as possible</li>
          <li>• Take your time and enjoy the calming experience</li>
        </ul>
      </div>
    </div>
  );
}
