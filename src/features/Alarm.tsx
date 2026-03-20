import { useState } from 'react';
import { Plus, Bell, Vibrate, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AlarmType } from '../types';

const DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

export default function Alarm() {
  const [alarms, setAlarms] = useState<AlarmType[]>([
    { id: '1', time: '07:00', enabled: true, days: [1, 2, 3, 4, 5], sound: true, vibrate: true, snooze: true, label: 'Работа' },
    { id: '2', time: '09:30', enabled: false, days: [0, 6], sound: true, vibrate: false, snooze: false, label: 'Выходные' },
  ]);
  const [editingAlarm, setEditingAlarm] = useState<AlarmType | null>(null);

  const toggleAlarm = (id: string) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const saveAlarm = (alarm: AlarmType) => {
    if (alarms.find(a => a.id === alarm.id)) {
      setAlarms(alarms.map(a => a.id === alarm.id ? alarm : a));
    } else {
      setAlarms([...alarms, alarm]);
    }
    setEditingAlarm(null);
  };

  const deleteAlarm = (id: string) => {
    setAlarms(alarms.filter(a => a.id !== id));
    setEditingAlarm(null);
  };

  const formatDays = (days: number[]) => {
    if (days.length === 0) return 'Никогда';
    if (days.length === 7) return 'Каждый день';
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return 'Будни';
    if (days.length === 2 && days.includes(0) && days.includes(6)) return 'Выходные';
    return days.sort().map(d => DAYS[d]).join(', ');
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-medium">Мои будильники</h2>
        <button 
          onClick={() => setEditingAlarm({ id: Date.now().toString(), time: '08:00', enabled: true, days: [], sound: true, vibrate: true, snooze: true, label: 'Новый будильник' })}
          className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-full transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar space-y-4 pb-4">
        <AnimatePresence>
          {alarms.map(alarm => (
            <motion.div 
              key={alarm.id}
              layout
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              className={`p-5 rounded-3xl transition-colors border ${alarm.enabled ? 'bg-zinc-100 dark:bg-zinc-900/80 border-transparent dark:border-zinc-800/50' : 'bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800/50'}`}
            >
              <div className="flex justify-between items-start mb-2">
                <div 
                  className="cursor-pointer flex-1"
                  onClick={() => setEditingAlarm(alarm)}
                >
                  <div className={`text-5xl font-light font-mono tracking-tighter ${alarm.enabled ? 'text-zinc-900 dark:text-zinc-50' : 'text-zinc-400 dark:text-zinc-600'}`}>
                    {alarm.time}
                  </div>
                  <div className={`text-sm mt-1 font-medium ${alarm.enabled ? 'text-zinc-600 dark:text-zinc-400' : 'text-zinc-400 dark:text-zinc-600'}`}>
                    {alarm.label} • {formatDays(alarm.days)}
                  </div>
                </div>
                
                {/* Toggle Switch */}
                <button 
                  onClick={() => toggleAlarm(alarm.id)}
                  className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ease-in-out ${alarm.enabled ? 'bg-orange-500' : 'bg-zinc-300 dark:bg-zinc-800'}`}
                >
                  <div className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${alarm.enabled ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {alarms.length === 0 && (
          <div className="text-center text-zinc-500 mt-10">
            Нет активных будильников
          </div>
        )}
      </div>

      {/* Alarm Editor Modal */}
      <AnimatePresence>
        {editingAlarm && (
          <AlarmEditor 
            alarm={editingAlarm} 
            onSave={saveAlarm} 
            onCancel={() => setEditingAlarm(null)} 
            onDelete={() => deleteAlarm(editingAlarm.id)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function AlarmEditor({ alarm, onSave, onCancel, onDelete }: { alarm: AlarmType, onSave: (a: AlarmType) => void, onCancel: () => void, onDelete: () => void }) {
  const [edited, setEdited] = useState(alarm);

  const toggleDay = (day: number) => {
    const newDays = edited.days.includes(day) 
      ? edited.days.filter(d => d !== day)
      : [...edited.days, day];
    setEdited({ ...edited, days: newDays });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="absolute inset-0 bg-white dark:bg-zinc-950 z-30 flex flex-col"
    >
      <div className="flex justify-between items-center p-6 border-b border-zinc-100 dark:border-zinc-800">
        <button onClick={onCancel} className="text-zinc-500 font-medium">Отмена</button>
        <h2 className="text-lg font-semibold">Изменить</h2>
        <button onClick={() => onSave(edited)} className="text-orange-500 font-medium">Сохранить</button>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8">
        {/* Time Picker */}
        <div className="flex justify-center mb-4">
          <input 
            type="time" 
            value={edited.time}
            onChange={e => setEdited({ ...edited, time: e.target.value })}
            className="text-7xl font-light font-mono bg-transparent outline-none text-center tracking-tighter"
          />
        </div>

        {/* Days */}
        <div>
          <h3 className="text-sm text-zinc-500 dark:text-zinc-400 mb-3 font-medium uppercase tracking-wide">Повтор</h3>
          <div className="flex justify-between">
            {DAYS.map((day, i) => {
              const dayIndex = i === 6 ? 0 : i + 1; // 0=Sun, 1=Mon
              const isSelected = edited.days.includes(dayIndex);
              return (
                <button
                  key={dayIndex}
                  onClick={() => toggleDay(dayIndex)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isSelected 
                      ? 'bg-orange-500 text-white' 
                      : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Settings */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
          <div className="p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Bell size={20} className="text-zinc-500" />
              <span className="font-medium">Звук</span>
            </div>
            <input type="checkbox" checked={edited.sound} onChange={e => setEdited({...edited, sound: e.target.checked})} className="w-5 h-5 accent-orange-500" />
          </div>
          <div className="p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Vibrate size={20} className="text-zinc-500" />
              <span className="font-medium">Вибрация</span>
            </div>
            <input type="checkbox" checked={edited.vibrate} onChange={e => setEdited({...edited, vibrate: e.target.checked})} className="w-5 h-5 accent-orange-500" />
          </div>
          <div className="p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <Moon size={20} className="text-zinc-500" />
              <span className="font-medium">Отложить (Snooze)</span>
            </div>
            <input type="checkbox" checked={edited.snooze} onChange={e => setEdited({...edited, snooze: e.target.checked})} className="w-5 h-5 accent-orange-500" />
          </div>
          <div className="p-4 flex justify-between items-center">
            <span className="text-zinc-500 font-medium">Название</span>
            <input 
              type="text" 
              value={edited.label}
              onChange={e => setEdited({...edited, label: e.target.value})}
              className="bg-transparent text-right outline-none w-32 font-medium"
              placeholder="Будильник"
            />
          </div>
        </div>

        <button 
          onClick={onDelete}
          className="w-full p-4 mt-8 text-red-500 bg-red-50 dark:bg-red-500/10 rounded-2xl font-medium transition-colors hover:bg-red-100 dark:hover:bg-red-500/20"
        >
          Удалить будильник
        </button>
      </div>
    </motion.div>
  );
}
