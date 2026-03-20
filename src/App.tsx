/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, AlarmClock, Timer as TimerIcon, Hourglass, Moon, Sun } from 'lucide-react';
import WorldClock from './features/WorldClock';
import Alarm from './features/Alarm';
import Stopwatch from './features/Stopwatch';
import Timer from './features/Timer';
import { Tab } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('world');
  const [isDark, setIsDark] = useState(true);

  // Apply dark mode class to HTML element
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Render the currently selected feature
  const renderTab = () => {
    switch (activeTab) {
      case 'world': return <WorldClock />;
      case 'alarm': return <Alarm />;
      case 'stopwatch': return <Stopwatch />;
      case 'timer': return <Timer />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans transition-colors duration-300 flex justify-center">
      {/* Mobile App Container */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden flex flex-col relative h-[100dvh]">
        
        {/* Header */}
        <header className="flex justify-between items-center p-6 pb-2 z-10">
          <h1 className="text-2xl font-semibold tracking-tight">
            {activeTab === 'world' && 'Мировое время'}
            {activeTab === 'alarm' && 'Будильник'}
            {activeTab === 'stopwatch' && 'Секундомер'}
            {activeTab === 'timer' && 'Таймер'}
          </h1>
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </header>

        {/* Main Content Area with Transitions */}
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="absolute inset-0 p-6"
            >
              {renderTab()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Navigation Bar */}
        <nav className="border-t border-zinc-200 dark:border-zinc-800/50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl pb-safe z-20">
          <div className="flex justify-around p-2">
            <NavItem icon={<Globe size={22} />} label="Мировое" isActive={activeTab === 'world'} onClick={() => setActiveTab('world')} />
            <NavItem icon={<AlarmClock size={22} />} label="Будильник" isActive={activeTab === 'alarm'} onClick={() => setActiveTab('alarm')} />
            <NavItem icon={<TimerIcon size={22} />} label="Секундомер" isActive={activeTab === 'stopwatch'} onClick={() => setActiveTab('stopwatch')} />
            <NavItem icon={<Hourglass size={22} />} label="Таймер" isActive={activeTab === 'timer'} onClick={() => setActiveTab('timer')} />
          </div>
        </nav>
      </div>
    </div>
  );
}

// Reusable Navigation Item Component
function NavItem({ icon, label, isActive, onClick }: { icon: ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center p-2 w-20 transition-all duration-200 ${
        isActive 
          ? 'text-orange-500 scale-105' 
          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'
      }`}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
