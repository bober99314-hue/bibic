import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { City } from '../types';

const AVAILABLE_CITIES: City[] = [
  { id: '1', name: 'Лондон', timezone: 'Europe/London' },
  { id: '2', name: 'Нью-Йорк', timezone: 'America/New_York' },
  { id: '3', name: 'Токио', timezone: 'Asia/Tokyo' },
  { id: '4', name: 'Дубай', timezone: 'Asia/Dubai' },
  { id: '5', name: 'Сидней', timezone: 'Australia/Sydney' },
  { id: '6', name: 'Париж', timezone: 'Europe/Paris' },
  { id: '7', name: 'Сингапур', timezone: 'Asia/Singapore' },
  { id: '8', name: 'Лос-Анджелес', timezone: 'America/Los_Angeles' },
];

export default function WorldClock() {
  const [time, setTime] = useState(new Date());
  const [cities, setCities] = useState<City[]>(AVAILABLE_CITIES.slice(0, 2));
  const [showAdd, setShowAdd] = useState(false);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const addCity = (city: City) => {
    if (!cities.find(c => c.id === city.id)) {
      setCities([...cities, city]);
    }
    setShowAdd(false);
  };

  const removeCity = (id: string) => {
    setCities(cities.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Local Time Display */}
      <div className="mb-8">
        <h2 className="text-sm text-zinc-500 dark:text-zinc-400 mb-1 font-medium tracking-wide uppercase">Местное время</h2>
        <div className="text-5xl font-light tracking-tighter font-mono">
          {time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
        <div className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
          {time.toLocaleDateString('ru-RU', { weekday: 'long', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium">Другие города</h2>
        <button 
          onClick={() => setShowAdd(true)} 
          className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Added Cities List */}
      <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
        <AnimatePresence>
          {cities.map(city => {
            // Calculate time for the specific city
            const cityTime = new Date(time.toLocaleString('en-US', { timeZone: city.timezone }));
            const isTomorrow = cityTime.getDate() > time.getDate();
            const isYesterday = cityTime.getDate() < time.getDate();
            
            return (
              <motion.div 
                key={city.id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                className="bg-zinc-100 dark:bg-zinc-900/80 p-5 rounded-3xl flex justify-between items-center group border border-transparent dark:border-zinc-800/50"
              >
                <div>
                  <h3 className="text-xl font-medium">{city.name}</h3>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">
                    {isTomorrow ? 'Завтра' : isYesterday ? 'Вчера' : 'Сегодня'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-light font-mono tracking-tight">
                    {cityTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <button 
                    onClick={() => removeCity(city.id)}
                    className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {cities.length === 0 && (
          <div className="text-center text-zinc-500 mt-10">
            Нет добавленных городов
          </div>
        )}
      </div>

      {/* Add City Modal */}
      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="absolute inset-0 bg-white dark:bg-zinc-950 z-30 flex flex-col"
          >
            <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
              <h2 className="text-xl font-semibold">Добавить город</h2>
              <button onClick={() => setShowAdd(false)} className="text-orange-500 font-medium p-2">Закрыть</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {AVAILABLE_CITIES.filter(c => !cities.find(existing => existing.id === c.id)).map(city => (
                <button
                  key={city.id}
                  onClick={() => addCity(city)}
                  className="w-full text-left p-4 bg-zinc-50 dark:bg-zinc-900 rounded-2xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors font-medium"
                >
                  {city.name}
                </button>
              ))}
              {AVAILABLE_CITIES.filter(c => !cities.find(existing => existing.id === c.id)).length === 0 && (
                <p className="text-center text-zinc-500 mt-10">Все доступные города добавлены</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
