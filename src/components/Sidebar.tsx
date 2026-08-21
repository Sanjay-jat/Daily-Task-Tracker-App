import React from 'react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  pendingTaskCount: number;
  onOpenSettings: () => void;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTaskCount,
  onOpenSettings,
  userName = 'Alex Sterling',
  userRole = 'Student • Focus Plan',
  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuC5Z2mV9EUG7uSfltFk6j53PXhcdOp9W2Fg7ngEvDZa5ZBfba6Tc50DZ66xlFycHFQipHgMCBfhSGlIFpiekqpEaDI0BdBb5JyCwahaT7EQ3y_BLh_pcADt__fEuXqFoQdmx99kQudEtIV9IWDlF9Cmh9K1ooIbP68vRHwzUixjTx1ExZex555HRfd617PVsrHh3KOvP5Z_5o3oWwxXgdtPl7TBxQBTo1y3_yI3UQyptWke40Nhkqxe',
}) => {
  const navItems: { id: ActiveTab; label: string; icon: string; badge?: number }[] = [
    { id: 'home', label: 'Daily Focus', icon: 'dashboard', badge: pendingTaskCount },
    { id: 'calendar', label: 'Calendar', icon: 'calendar_today' },
    { id: 'college', label: 'College Hub', icon: 'school' },
    { id: 'projects', label: 'Projects', icon: 'layers' },
  ];

  return (
    <aside className="hidden md:flex flex-col w-[270px] h-screen bg-zinc-50/80 backdrop-blur-md border-r border-zinc-200/80 p-5 z-40 fixed left-0 top-0 select-none justify-between">
      {/* Brand Header */}
      <div>
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group flex items-center gap-3 px-2 py-2 mb-6"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
            <div className="w-5 h-5 border-2 border-white rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
          </div>
          <div>
            <div className="font-display text-lg font-bold text-zinc-900 tracking-tight leading-none">
              EduFlow
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
              Bento Workspace
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-semibold text-xs transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-sm font-bold'
                    : 'text-zinc-600 hover:bg-white hover:text-zinc-900 hover:border-zinc-200/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={{
                      fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.id === 'home' && pendingTaskCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                      isActive
                        ? 'bg-indigo-500 text-white'
                        : 'bg-zinc-200/80 text-zinc-700'
                    }`}
                  >
                    {pendingTaskCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User / Profile Bento footer */}
      <div className="bg-white border border-zinc-200 rounded-[24px] p-3.5 shadow-sm flex items-center justify-between">
        <div 
          onClick={onOpenSettings} 
          className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
          title="Open student profile"
        >
          <div className="relative shrink-0">
            <img
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-zinc-200 group-hover:ring-indigo-600 transition-all"
              alt={userName}
              src={avatarUrl}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col text-left truncate">
            <span className="font-bold text-xs text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
              {userName}
            </span>
            <span className="text-[11px] text-zinc-400 font-medium truncate">{userRole}</span>
          </div>
        </div>

        <button
          onClick={onOpenSettings}
          className="text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-xl p-2 transition-all shrink-0"
          title="Settings"
          aria-label="Settings"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
    </aside>
  );
};

