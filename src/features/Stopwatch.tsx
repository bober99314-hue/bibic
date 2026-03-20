import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Lap } from '../types';

export default function Stopwatch() {
  const [isRunning, setIsRunning] = useState(false);
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();

  const animate = (timeNow: number) => {
    if (previousTimeRef.current != undefined) {
      const deltaTime = timeNow - previousTimeRef.current;
      setTime(prevTime => prevTime + deltaTime);
    }
    previousTimeRef.current = timeNow;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      previousTimeRef.current = undefined;
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLapReset = () => {
    if (isRunning) {
      // Add lap
      const lastLapOverall = laps.length > 0 ? laps[0].overallTime : 0;
      const lapTime = time - lastLapOverall;
      setLaps([{ id: Date.now().toString(), time: lapTime, overallTime: time }, ...laps]);
    } else {
      // Reset
      setTime(0);
      setLaps([]);
    }
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-7xl font-light font-mono tabular-nums tracking-tighter">
          {formatTime(time)}
        </div>
      </div>

      <div className="flex justify-center gap-12 mb-8">
        <button 
          onClick={handleLapReset}
          className="w-20 h-20 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
        >
          {isRunning ? <Flag size={24} /> : <RotateCcw size={24} />}
        </button>
        <button 
          onClick={handleStartStop}
          className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
            isRunning 
              ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500' 
              : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-500'
          }`}
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar border-t border-zinc-200 dark:border-zinc-800/50 pt-2">
        <AnimatePresence>
          {laps.map((lap, index) => (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              key={lap.id} 
              className="flex justify-between py-3 border-b border-zinc-100 dark:border-zinc-800/50 text-lg px-2"
            >
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">Круг {laps.length - index}</span>
              <span className="font-mono tracking-tight">{formatTime(lap.time)}</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {laps.length === 0 && (
          <div className="text-center text-zinc-500 mt-10">
            Нет кругов
          </div>
        )}
      </div>
    </div>
  );
}
