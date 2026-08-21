import React from 'react';

interface MobileHeaderProps {
  onOpenSettings: () => void;
  pendingTaskCount: number;
  avatarUrl?: string;
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  onOpenSettings,
  pendingTaskCount,
  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCkPPGTIrEKM7jCOSD5FGmmsdAG8ivG26HNAz_kAG4jDXhn6309H81vdQHtoJhI6Qh8qZIR5NkeJkLuDq7ouTzqDEuq5ZLeb0lEtC4T67soX-DlPBsUI3g5iD4VN9EAItWi7Lxa8GeO6HuutfV19qtA8lLIoQF4-XFa7BCXDC6laGNmGx07AiZD8rBMCCi36Nt4PCQGHmwtMAiUTpPb2CDKCAACyn3gBGQDMyMvx29208ogzW5Ke5Eq',
}) => {
  return (
    <header className="md:hidden flex justify-between items-center px-5 py-3.5 w-full top-0 sticky bg-white/90 backdrop-blur-md border-b border-zinc-200/80 z-50">
      <button onClick={onOpenSettings} className="flex items-center gap-2 active:scale-95 transition-transform">
        <img
          className="w-9 h-9 rounded-full object-cover shadow-2xs ring-2 ring-zinc-200"
          alt="Student Avatar"
          src={avatarUrl}
        />
      </button>

      <div className="flex items-center gap-2">
        <div className="w-6 h-6 bg-zinc-900 rounded-lg flex items-center justify-center text-white text-xs font-bold font-mono">
          E
        </div>
        <span className="font-display text-lg font-bold text-zinc-900 tracking-tight">
          EduFlow
        </span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenSettings}
          className="text-zinc-600 hover:bg-zinc-100 relative transition-colors rounded-full p-2 active:scale-95"
          aria-label="Notifications & Settings"
        >
          <span className="material-symbols-outlined text-[22px]">notifications</span>
          {pendingTaskCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>
    </header>
  );
};
