import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Task, TaskCategory } from '../types';
import { STUDY_TIPS } from '../data/mockData';
import { audioManager } from '../utils/audio';

interface DailyFocusViewProps {
  tasks: Task[];
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenBreakModal: () => void;
  soundEnabled: boolean;
}

export const DailyFocusView: React.FC<DailyFocusViewProps> = ({
  tasks,
  onToggleTask,
  onDeleteTask,
  onOpenNewTaskModal,
  onOpenBreakModal,
  soundEnabled,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | TaskCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTipIndex, setCurrentTipIndex] = useState(0);

  // Statistics calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const inReviewTasks = tasks.filter((t) => !t.completed && t.priority === 'high').length;
  const remainingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    const matchesFilter = selectedFilter === 'all' || task.category === selectedFilter;
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (task.course && task.course.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  // SVG circular progress calculation
  const circumference = 251.327;
  const strokeDashoffset = circumference - (completionPercentage / 100) * circumference;

  const handleToggle = (id: string, isCurrentlyCompleted: boolean) => {
    onToggleTask(id);
    if (!isCurrentlyCompleted) {
      if (soundEnabled) {
        audioManager.playTaskCompleteChime();
      }
      if (remainingTasks === 1) {
        confetti({
          particleCount: 75,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#18181b', '#10b981', '#f59e0b'],
        });
      }
    }
  };

  const currentTip = STUDY_TIPS[currentTipIndex % STUDY_TIPS.length];

  // Weekly study output chart data (bento style)
  const weeklyData = [
    { day: 'Mon', val: '45%', active: false, hours: '3.5h' },
    { day: 'Tue', val: '70%', active: false, hours: '5.2h' },
    { day: 'Wed', val: '55%', active: false, hours: '4.0h' },
    { day: 'Thu', val: '92%', active: true, hours: '6.8h' },
    { day: 'Fri', val: '50%', active: false, hours: '3.8h' },
    { day: 'Sat', val: '75%', active: false, hours: '5.5h' },
    { day: 'Sun', val: '35%', active: false, hours: '2.5h' },
  ];

  return (
    <div className="max-w-[1240px] mx-auto space-y-5">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Daily Focus
            </h1>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200/80 text-emerald-700 rounded-full text-xs font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Oct 24, 2023
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            {remainingTasks === 0
              ? 'All daily targets accomplished! Exceptional momentum.'
              : `${remainingTasks} pending deliverables in your queue today.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBreakModal}
            className="flex items-center gap-2 bg-white border border-zinc-200 text-zinc-700 px-4 py-2.5 rounded-2xl font-bold text-xs hover:bg-zinc-50 hover:text-zinc-900 transition-all shadow-2xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600">timer</span>
            Focus Sprint
          </button>
          <button
            onClick={onOpenNewTaskModal}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            New Task
          </button>
        </div>
      </div>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bento Block 1: Tasks Queue (Large Bento spanning 8 columns) */}
        <div className="md:col-span-8 bg-white border border-zinc-200/90 rounded-[32px] p-6 sm:p-7 shadow-xs flex flex-col justify-between space-y-5">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                  Sprint Backlog
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 mt-0.5">
                  Today's Objectives
                </h2>
              </div>

              {/* Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'academic', label: 'Academic' },
                    { id: 'personal', label: 'Personal' },
                    { id: 'errands', label: 'Errands' },
                  ] as const
                ).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFilter(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedFilter === f.id
                        ? 'bg-zinc-900 text-white shadow-xs'
                        : 'bg-zinc-100/80 text-zinc-600 hover:bg-zinc-200/70'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search filter input */}
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search focus deliverables, notes, or course codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-2xl bg-zinc-50 text-xs font-medium text-zinc-900 placeholder-zinc-400 border border-zinc-200/70 focus:border-indigo-500 focus:bg-white focus:outline-none transition-all"
              />
              <span className="material-symbols-outlined absolute left-3 top-2 text-[18px] text-zinc-400">
                search
              </span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2 text-zinc-400 hover:text-zinc-700"
                >
                  <span className="material-symbols-outlined text-[16px]">cancel</span>
                </button>
              )}
            </div>

            {/* Tasks list */}
            <div className="space-y-2.5">
              {filteredTasks.length === 0 ? (
                <div className="py-12 text-center flex flex-col items-center justify-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200">
                  <span className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-2">
                    <span className="material-symbols-outlined text-[22px]">checklist</span>
                  </span>
                  <div className="text-sm font-bold text-zinc-900">No items found</div>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {searchQuery ? 'Adjust your search query' : 'Queue is empty for this view'}
                  </p>
                </div>
              ) : (
                filteredTasks.map((task) => {
                  let accentBadge = 'bg-indigo-50 text-indigo-700 border-indigo-200/60';
                  let borderHover = 'hover:border-indigo-500/50';

                  if (task.category === 'personal') {
                    accentBadge = 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
                    borderHover = 'hover:border-emerald-500/50';
                  } else if (task.category === 'errands') {
                    accentBadge = 'bg-amber-50 text-amber-700 border-amber-200/60';
                    borderHover = 'hover:border-amber-500/50';
                  }

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggle(task.id, task.completed)}
                      className={`task-item bg-zinc-50/70 hover:bg-white border border-zinc-200/80 rounded-2xl p-3.5 flex items-center justify-between group cursor-pointer transition-all duration-150 ${borderHover} ${
                        task.completed ? 'opacity-60 bg-zinc-100/50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 pr-2">
                        {/* Bento Checkbox */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggle(task.id, task.completed);
                          }}
                          className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all shrink-0 ${
                            task.completed
                              ? 'bg-zinc-900 border-zinc-900 text-white'
                              : 'border-zinc-300 bg-white hover:border-indigo-600'
                          }`}
                        >
                          {task.completed && (
                            <span className="material-symbols-outlined text-[14px] font-bold">
                              check
                            </span>
                          )}
                        </button>

                        <div className="flex flex-col min-w-0">
                          <span
                            className={`text-sm font-semibold text-zinc-900 truncate ${
                              task.completed ? 'line-through text-zinc-400' : ''
                            }`}
                          >
                            {task.title}
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider border ${accentBadge}`}
                            >
                              {task.category}
                            </span>

                            <span className="text-[11px] text-zinc-500 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-zinc-400">
                                {task.metaIcon || 'schedule'}
                              </span>
                              {task.metaText}
                            </span>

                            {task.course && (
                              <span className="text-[11px] font-mono font-medium text-zinc-600 bg-white px-1.5 py-0.5 rounded border border-zinc-200/60 hidden sm:inline-block">
                                {task.course}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTask(task.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-zinc-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Bottom Card Summary Row */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between text-xs text-zinc-500">
            <span className="font-medium font-mono text-[11px]">
              TOTAL: {totalTasks} | COMPLETED: {completedTasks} | REMAINING: {remainingTasks}
            </span>
            <button
              onClick={onOpenNewTaskModal}
              className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[15px]">add_circle</span>
              Quick Add
            </button>
          </div>
        </div>

        {/* Right Stack: Bento Modules (4 cols) */}
        <div className="md:col-span-4 space-y-4 flex flex-col">
          {/* Bento Block 2: Quick Action / Focus Sprint (Indigo Accent Card) */}
          <div className="bg-indigo-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-sm flex flex-col justify-between min-h-[160px]">
            <div className="relative z-10">
              <p className="text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">
                Deep Work Mode
              </p>
              <h3 className="text-xl font-bold tracking-tight mb-4">
                Launch Focus Sprint
              </h3>
              <button
                onClick={onOpenBreakModal}
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-2xl font-bold text-xs transition-all active:scale-95 shadow-sm inline-flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-[16px]">bolt</span>
                Start 25m Timer
              </button>
            </div>
            {/* Bento decorative accents */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500 rounded-full opacity-40 pointer-events-none"></div>
            <div className="absolute top-2 right-2 w-16 h-16 border-4 border-indigo-400 rounded-full opacity-20 pointer-events-none"></div>
          </div>

          {/* Bento Block 3: Dark Sync & Daily Completion Rate */}
          <div className="bg-zinc-900 rounded-[32px] p-6 text-white flex flex-col justify-between min-h-[160px] shadow-sm">
            <div className="flex justify-between items-center">
              <div className="w-10 h-10 bg-zinc-800 rounded-2xl flex items-center justify-center text-xl">
                ⚡
              </div>
              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                SYNC: ACTIVE
              </span>
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight font-display text-white">
                  {completionPercentage}%
                </h3>
                <span className="text-xs text-zinc-400 font-medium">Daily Completion</span>
              </div>
              <div className="mt-3 w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bento Block 4: Study Tip & Guidance */}
          <div className="bg-white border border-zinc-200/90 rounded-[32px] p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-amber-500">
                    lightbulb
                  </span>
                  Study Insight
                </span>
                <button
                  onClick={() => setCurrentTipIndex((prev) => prev + 1)}
                  className="text-zinc-400 hover:text-zinc-900 p-1 rounded-lg hover:bg-zinc-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">refresh</span>
                </button>
              </div>

              <h4 className="font-bold text-sm text-zinc-900 mb-1">{currentTip.title}</h4>
              <p className="text-xs text-zinc-500 leading-relaxed">{currentTip.text}</p>
            </div>

            <button
              onClick={onOpenBreakModal}
              className="mt-4 w-full py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[15px]">spa</span>
              {currentTip.cta}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bento Row: Productivity Chart & Multi-Metric Strip */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Bento Block 5: Weekly Productivity Chart (Spanning 8 columns) */}
        <div className="md:col-span-8 bg-white border border-zinc-200/90 rounded-[32px] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-bold tracking-tight text-zinc-900">
                Weekly Study Output
              </h3>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold">
                +14.8% Focus
              </span>
            </div>
            <p className="text-zinc-500 text-xs max-w-md mb-6">
              Your study consistency is outpacing previous sprints. Great momentum on STEM lab work.
            </p>
          </div>

          {/* Visual Vertical Bars */}
          <div className="flex items-end gap-3 h-36 pt-4">
            {weeklyData.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                <div className="text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {d.hours}
                </div>
                <div
                  className={`w-full rounded-2xl transition-all duration-300 cursor-pointer ${
                    d.active
                      ? 'bg-indigo-600 shadow-md shadow-indigo-600/20'
                      : 'bg-zinc-100 group-hover:bg-zinc-200'
                  }`}
                  style={{ height: d.val }}
                ></div>
                <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Bento Block 6: Multi-Statistic Counter (Spanning 4 columns) */}
        <div className="md:col-span-4 bg-white border border-zinc-200/90 rounded-[32px] p-6 shadow-xs flex flex-col justify-between space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Performance Metrics
            </span>
            <span className="text-[11px] font-mono text-zinc-400">TERM 2023</span>
          </div>

          {/* 3 Bento counters with vertical dividers */}
          <div className="flex items-center justify-between px-2">
            <div>
              <p className="text-3xl font-extrabold text-zinc-900 font-display">{totalTasks}</p>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Total
              </p>
            </div>
            <div className="w-[1px] h-10 bg-zinc-200"></div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600 font-display">{completedTasks}</p>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                Completed
              </p>
            </div>
            <div className="w-[1px] h-10 bg-zinc-200"></div>
            <div>
              <p className="text-3xl font-extrabold text-indigo-600 font-display">{inReviewTasks}</p>
              <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mt-0.5">
                High Priority
              </p>
            </div>
          </div>

          {/* Team / Collaborators avatar overlap */}
          <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-600">Study Cohort</span>
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[10px] font-bold text-zinc-600">
                EV
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                MC
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                SA
              </div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-900 text-white flex items-center justify-center text-[10px] font-bold">
                +4
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

