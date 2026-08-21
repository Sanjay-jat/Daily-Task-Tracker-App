import React from 'react';
import { ActiveTab } from '../types';

interface MobileBottomNavProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTaskCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTaskCount,
}) => {
  const tabs: { id: ActiveTab; label: string; icon: string }[] = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_month' },
    { id: 'college', label: 'College', icon: 'schedule' },
    { id: 'projects', label: 'Projects', icon: 'assignment' },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-3 py-2 bg-white/95 backdrop-blur-md border-t border-zinc-200/90 shadow-lg">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all relative ${
              isActive
                ? 'bg-zinc-900 text-white shadow-xs scale-105'
                : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            <span
              className="material-symbols-outlined text-[20px]"
              style={{
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}
            >
              {tab.icon}
            </span>
            <span className="text-[11px] font-semibold mt-0.5">{tab.label}</span>
            {tab.id === 'home' && pendingTaskCount > 0 && !isActive && (
              <span className="absolute -top-1 right-2 w-2 h-2 rounded-full bg-indigo-600"></span>
            )}
          </button>
        );
      })}
    </nav>
  );
};
