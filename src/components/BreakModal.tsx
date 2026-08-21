import React, { useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';

interface BreakModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BreakModal: React.FC<BreakModalProps> = ({ isOpen, onClose }) => {
  const [timerMinutes, setTimerMinutes] = useState<number>(15);
  const [secondsLeft, setSecondsLeft] = useState<number>(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [ambientSound, setAmbientSound] = useState<'none' | 'rain' | 'whitenoise' | 'drone'>('none');
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Rest'>('Inhale');
  const breathCountRef = useRef<number>(0);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      audioManager.playTimerBell();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsLeft]);

  // Breathing cycle animation timer (4s Inhale, 4s Hold, 4s Exhale, 4s Rest)
  useEffect(() => {
    if (!isOpen) return;
    const breathInterval = setInterval(() => {
      breathCountRef.current = (breathCountRef.current + 1) % 16;
      const step = breathCountRef.current;
      if (step < 4) setBreathPhase('Inhale');
      else if (step < 8) setBreathPhase('Hold');
      else if (step < 12) setBreathPhase('Exhale');
      else setBreathPhase('Rest');
    }, 1000);
    return () => clearInterval(breathInterval);
  }, [isOpen]);

  const handleSelectDuration = (mins: number) => {
    setTimerMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsTimerRunning(false);
  };

  const handleToggleAmbient = (type: 'rain' | 'whitenoise' | 'drone') => {
    if (ambientSound === type) {
      audioManager.stopAmbient();
      setAmbientSound('none');
    } else {
      audioManager.startAmbient(type);
      setAmbientSound(type);
    }
  };

  const handleClose = () => {
    audioManager.stopAmbient();
    setAmbientSound('none');
    setIsTimerRunning(false);
    onClose();
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[32px] w-full max-w-xl shadow-2xl overflow-hidden border border-zinc-200 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner Gradient */}
        <div className="bg-zinc-900 p-6 text-white relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center text-emerald-400 font-bold">
                🧘
              </span>
              <div>
                <h2 className="font-display text-xl font-bold">Mindful Study Break</h2>
                <p className="text-xs text-zinc-400">Recharge cognitive focus & prevent burnout</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Preset Buttons */}
          <div className="flex items-center justify-center gap-2">
            {[
              { label: '5m Stretch', mins: 5 },
              { label: '15m Walk & Rest', mins: 15 },
              { label: '25m Focus Block', mins: 25 },
            ].map((preset) => (
              <button
                key={preset.mins}
                onClick={() => handleSelectDuration(preset.mins)}
                className={`px-3.5 py-1.5 rounded-2xl text-xs font-semibold transition-all ${
                  timerMinutes === preset.mins
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Central Timer & Breath Guide */}
          <div className="flex flex-col items-center justify-center py-6 bg-zinc-50 rounded-[28px] border border-zinc-200/80 relative overflow-hidden">
            {/* Breathing animation ring */}
            <div
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                breathPhase === 'Inhale'
                  ? 'scale-110 border-indigo-600 bg-indigo-50/70'
                  : breathPhase === 'Hold'
                  ? 'scale-110 border-emerald-500 bg-emerald-50/70'
                  : breathPhase === 'Exhale'
                  ? 'scale-90 border-zinc-700 bg-zinc-100'
                  : 'scale-95 border-zinc-300 bg-white'
              }`}
            >
              <span className="font-display text-3xl font-extrabold text-zinc-900 font-mono tracking-tight">
                {formattedTime}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 font-mono mt-1">
                {breathPhase}
              </span>
            </div>

            {/* Play/Pause CTA */}
            <div className="mt-5 flex items-center gap-3">
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className={`px-6 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all shadow-sm ${
                  isTimerRunning
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isTimerRunning ? 'pause' : 'play_arrow'}
                </span>
                {isTimerRunning ? 'Pause Timer' : 'Start Countdown'}
              </button>

              <button
                onClick={() => {
                  setSecondsLeft(timerMinutes * 60);
                  setIsTimerRunning(false);
                }}
                className="p-2.5 rounded-2xl border border-zinc-200 text-zinc-600 hover:bg-white transition-colors"
                title="Reset timer"
              >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              </button>
            </div>
          </div>

          {/* Ambient Soundscapes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-indigo-600">headphones</span>
                Relaxing Background Soundscape
              </span>
              {ambientSound !== 'none' && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Playing Sound
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'rain' as const, label: 'Gentle Rain', icon: 'water_drop' },
                { id: 'whitenoise' as const, label: 'White Noise', icon: 'graphic_eq' },
                { id: 'drone' as const, label: 'Meditation', icon: 'spa' },
              ].map((sound) => {
                const isActive = ambientSound === sound.id;
                return (
                  <button
                    key={sound.id}
                    onClick={() => handleToggleAmbient(sound.id)}
                    className={`py-2.5 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isActive
                        ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                        : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{sound.icon}</span>
                    {sound.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Micro Tips */}
          <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 flex items-start gap-3">
            <span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
              tips_and_updates
            </span>
            <div className="text-xs text-zinc-600 leading-relaxed">
              <strong className="text-zinc-900 block mb-0.5">The 20-20-20 Eye Rest Rule:</strong>
              Every 20 minutes, look at an object 20 feet away for 20 seconds to reduce ocular fatigue from screens and textbooks.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-50/80 border-t border-zinc-100 flex items-center justify-end">
          <button
            onClick={handleClose}
            className="px-5 py-2.5 rounded-2xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-all shadow-sm"
          >
            Ready to Resume Study
          </button>
        </div>
      </div>
    </div>
  );
};
