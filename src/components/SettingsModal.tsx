import React, { useState } from 'react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  setUserName: (name: string) => void;
  userRole: string;
  setUserRole: (role: string) => void;
  dailyGoal: number;
  setDailyGoal: (goal: number) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  userName,
  setUserName,
  userRole,
  setUserRole,
  dailyGoal,
  setDailyGoal,
  soundEnabled,
  setSoundEnabled,
  onResetData,
}) => {
  const [tempName, setTempName] = useState(userName);
  const [tempRole, setTempRole] = useState(userRole);
  const [tempGoal, setTempGoal] = useState(dailyGoal);
  const [tempSound, setTempSound] = useState(soundEnabled);
  const [savedToast, setSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserName(tempName.trim() || 'Alex Riley');
    setUserRole(tempRole.trim() || 'Student');
    setDailyGoal(tempGoal);
    setSoundEnabled(tempSound);
    setSavedToast(true);
    setTimeout(() => {
      setSavedToast(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-zinc-900 text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-zinc-900">EduFlow Settings</h2>
              <p className="text-xs text-zinc-500">Customize profile & focus preferences</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          {/* Profile Details */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Student Name
            </label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm text-zinc-900 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Major / Academic Role
            </label>
            <input
              type="text"
              value={tempRole}
              onChange={(e) => setTempRole(e.target.value)}
              placeholder="e.g. Physics & CS Undergrad"
              className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm text-zinc-900 font-medium"
            />
          </div>

          {/* Daily Focus Goal */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-500">
                Daily Task Target Goal
              </label>
              <span className="text-xs font-bold font-mono text-indigo-600">{tempGoal} tasks/day</span>
            </div>
            <input
              type="range"
              min={3}
              max={15}
              value={tempGoal}
              onChange={(e) => setTempGoal(Number(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Audio Chime Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/80">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-indigo-600 text-[22px]">volume_up</span>
              <div>
                <div className="text-xs font-bold text-zinc-900">Task Completion Chime</div>
                <div className="text-[11px] text-zinc-500">Play gentle chime when checking off tasks</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={tempSound}
              onChange={(e) => setTempSound(e.target.checked)}
              className="w-5 h-5 accent-indigo-600 rounded-md cursor-pointer"
            />
          </div>

          {/* Reset Demo Data */}
          <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset tasks, courses, and schedules back to default sample state?')) {
                  onResetData();
                  onClose();
                }
              }}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              Reset Demo Data
            </button>
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95 flex items-center gap-2"
            >
              {savedToast ? (
                <>
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Saved!
                </>
              ) : (
                'Save Preferences'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
