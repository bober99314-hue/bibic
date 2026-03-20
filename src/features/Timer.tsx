import { useState, useEffect, useRef } from 'react';
import { Play, Pause, X, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const intervalRef = useRef<number>();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning) {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    if (timeLeft === 0) {
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (totalSeconds === 0) return;
      setTimeLeft(totalSeconds);
      setTotalTime(totalSeconds);
    }
    setIsRunning(true);
    setIsFinished(false);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleCancel = () => {
    setIsRunning(false);
    setTimeLeft(0);
    setIsFinished(false);
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <AnimatePresence mode="wait">
          {timeLeft === 0 && !isFinished ? (
            <motion.div 
              key="picker"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-4 text-5xl font-light font-mono"
            >
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  min="0" max="99" 
                  value={hours} 
                  onChange={e => setHours(Number(e.target.value))}
                  className="w-20 bg-transparent text-center outline-none border-b-2 border-transparent focus:border-orange-500 transition-colors"
                />
                <span className="text-sm text-zinc-500 mt-2 font-sans font-medium">ч</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700 pb-8">:</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  min="0" max="59" 
                  value={minutes} 
                  onChange={e => setMinutes(Number(e.target.value))}
                  className="w-20 bg-transparent text-center outline-none border-b-2 border-transparent focus:border-orange-500 transition-colors"
                />
                <span className="text-sm text-zinc-500 mt-2 font-sans font-medium">м</span>
              </div>
              <span className="text-zinc-300 dark:text-zinc-700 pb-8">:</span>
              <div className="flex flex-col items-center">
                <input 
                  type="number" 
                  min="0" max="59" 
                  value={seconds} 
                  onChange={e => setSeconds(Number(e.target.value))}
                  className="w-20 bg-transparent text-center outline-none border-b-2 border-transparent focus:border-orange-500 transition-colors"
                />
                <span className="text-sm text-zinc-500 mt-2 font-sans font-medium">с</span>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="countdown"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-72 h-72 flex items-center justify-center"
            >
              {/* Circular Progress */}
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle 
                  cx="144" cy="144" r="136" 
                  className="stroke-zinc-100 dark:stroke-zinc-900" 
                  strokeWidth="6" fill="none" 
                />
                <circle 
                  cx="144" cy="144" r="136" 
                  className="stroke-orange-500 transition-all duration-1000 ease-linear" 
                  strokeWidth="6" fill="none" 
                  strokeDasharray={2 * Math.PI * 136}
                  strokeDashoffset={2 * Math.PI * 136 * (progress / 100)}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className={`text-7xl font-light font-mono tabular-nums tracking-tighter ${isFinished ? 'text-orange-500 animate-pulse' : ''}`}>
                {formatTime(timeLeft)}
              </div>
              
              {isFinished && (
                <div className="absolute -bottom-12 flex items-center gap-2 text-orange-500 font-medium">
                  <BellRing className="animate-bounce" />
                  <span>Время вышло!</span>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex justify-center gap-12 mb-8">
        <button 
          onClick={handleCancel}
          disabled={timeLeft === 0 && !isFinished}
          className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X size={24} />
        </button>
        <button 
          onClick={isRunning ? handlePause : handleStart}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
            isRunning 
              ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500' 
              : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500'
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
      </div>
    </div>
  );
}
