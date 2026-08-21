import React, { useState } from 'react';
import { ScheduleEvent, Course } from '../types';

interface CalendarViewProps {
  events: ScheduleEvent[];
  courses: Course[];
  onAddEvent: (event: Omit<ScheduleEvent, 'id'>) => void;
  onOpenBreakModal: () => void;
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  courses,
  onAddEvent,
  onOpenBreakModal,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1); // Default Monday (Oct 24 week)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState(courses[0]?.code || 'PHYS 201');
  const [newType, setNewType] = useState<ScheduleEvent['type']>('lecture');
  const [newStartTime, setNewStartTime] = useState('10:00');
  const [newEndTime, setNewEndTime] = useState('11:30');
  const [newLocation, setNewLocation] = useState('Science Hall 304');

  // Filter events for active day
  const dayEvents = events
    .filter((e) => e.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let color = '#3525cd';
    if (newType === 'lab') color = '#006a61';
    if (newType === 'personal') color = '#885500';
    if (newType === 'study') color = '#4f46e5';

    onAddEvent({
      title: newTitle.trim(),
      course: newCourse,
      type: newType,
      dayOfWeek: selectedDay,
      startTime: newStartTime,
      endTime: newEndTime,
      location: newLocation.trim() || 'Campus',
      color,
    });

    setNewTitle('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Academic Calendar
            </h1>
            <span className="px-3 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 rounded-full text-xs font-bold font-mono">
              WEEK 9
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Weekly class schedule, laboratory sessions, and study blocks
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenBreakModal}
            className="flex items-center gap-2 bg-white text-zinc-700 border border-zinc-200 px-4 py-2.5 rounded-2xl font-bold text-xs hover:bg-zinc-50 transition-all shadow-2xs"
          >
            <span className="material-symbols-outlined text-[18px] text-indigo-600">timer</span>
            Study Focus
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Add Event
          </button>
        </div>
      </div>

      {/* Week Day Tabs (Bento Style) */}
      <div className="grid grid-cols-7 gap-2 bg-white p-2 rounded-[28px] border border-zinc-200/90 shadow-2xs">
        {DAY_SHORT.map((day, idx) => {
          const isSelected = selectedDay === idx;
          const count = events.filter((e) => e.dayOfWeek === idx).length;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(idx)}
              className={`flex flex-col items-center py-3 px-1 rounded-2xl transition-all ${
                isSelected
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900'
              }`}
            >
              <span className="text-[11px] font-bold uppercase tracking-wider">{day}</span>
              <span
                className={`text-[11px] font-mono font-semibold mt-1 px-2 py-0.5 rounded-full ${
                  isSelected ? 'bg-indigo-500 text-white' : 'text-zinc-400'
                }`}
              >
                {count} {count === 1 ? 'evt' : 'evts'}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Day Timeline & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Schedule list (Bento 8 cols) */}
        <div className="lg:col-span-8 bg-white border border-zinc-200/90 rounded-[32px] p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
                Scheduled Agenda
              </span>
              <h2 className="font-display text-xl font-bold text-zinc-900 mt-0.5">
                {DAYS[selectedDay]} Schedule
              </h2>
            </div>
            <span className="text-xs font-mono font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-xl">
              {dayEvents.length} session{dayEvents.length === 1 ? '' : 's'}
            </span>
          </div>

          {dayEvents.length === 0 ? (
            <div className="rounded-2xl p-12 text-center bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center">
              <span className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[24px]">event_busy</span>
              </span>
              <h3 className="font-bold text-zinc-900 text-sm">No classes scheduled</h3>
              <p className="text-xs text-zinc-400 mt-1 max-w-xs">
                Enjoy your free time or schedule a study block for upcoming assignments.
              </p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold hover:bg-zinc-800"
              >
                Schedule Study Block
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {dayEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-zinc-50/70 hover:bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-indigo-500/50 transition-all relative overflow-hidden group"
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-white border border-zinc-200/80 flex items-center justify-center text-xs font-bold text-zinc-700 shrink-0 font-mono shadow-2xs">
                      {evt.type.slice(0, 3).toUpperCase()}
                    </div>

                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                          {evt.title}
                        </span>
                        {evt.course && (
                          <span className="text-[11px] font-mono font-semibold text-zinc-600 bg-white px-1.5 py-0.5 rounded border border-zinc-200/70">
                            {evt.course}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 mt-1">
                        <span className="flex items-center gap-1 font-mono">
                          <span className="material-symbols-outlined text-[13px] text-zinc-400">schedule</span>
                          {evt.startTime} – {evt.endTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px] text-zinc-400">location_on</span>
                          {evt.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-xl self-start sm:self-center shrink-0">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick glance & Upcoming Exams (Bento 4 cols) */}
        <div className="lg:col-span-4 space-y-4 flex flex-col">
          {/* Quick Notice Bento */}
          <div className="bg-indigo-600 rounded-[32px] p-6 text-white relative overflow-hidden shadow-sm">
            <div className="relative z-10">
              <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">
                Sync Status
              </span>
              <h3 className="text-lg font-bold mt-1 mb-2">Automated Calendar Sync</h3>
              <p className="text-xs text-indigo-100/90 leading-relaxed mb-4">
                Lecture recordings and seminar links automatically attach 15 minutes before start.
              </p>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/10 px-3 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-300"></span>
                Canvas LMS Connected
              </span>
            </div>
            <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-indigo-500 rounded-full opacity-40"></div>
          </div>

          <div className="bg-white border border-zinc-200/90 rounded-[32px] p-6 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
                  Key Deadlines
                </span>
                <span className="material-symbols-outlined text-zinc-400 text-[18px]">
                  alarm
                </span>
              </div>

              <div className="space-y-2.5">
                {courses.map((c) => {
                  if (!c.upcomingExam) return null;
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/70 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-zinc-900">{c.upcomingExam.title}</div>
                        <div className="text-[11px] font-mono text-zinc-500 mt-0.5">{c.code}</div>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                        {c.upcomingExam.date}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-zinc-100 text-[11px] text-zinc-400 text-center font-medium">
              Registrar Verified
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal (Bento styled) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 sm:p-7 shadow-2xl border border-zinc-200">
            <h3 className="font-display text-xl font-bold text-zinc-900 mb-4">Add Schedule Event</h3>
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Event Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Physics Review Session"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Event Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ScheduleEvent['type'])}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                  >
                    <option value="lecture">Lecture</option>
                    <option value="lab">Lab</option>
                    <option value="study">Study Block</option>
                    <option value="personal">Personal / Gym</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Location / Room
                </label>
                <input
                  type="text"
                  placeholder="e.g. Turing Hall 102"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Save to Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
