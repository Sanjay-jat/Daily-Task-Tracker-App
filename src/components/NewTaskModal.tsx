import React, { useState } from 'react';
import { Task, TaskCategory } from '../types';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  courses: { code: string; name: string }[];
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  courses,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>('academic');
  const [metaIcon, setMetaIcon] = useState('schedule');
  const [metaText, setMetaText] = useState('Due Today, 11:59 PM');
  const [course, setCourse] = useState(courses[0]?.code || 'PHYS 201');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [notes, setNotes] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      category,
      metaIcon,
      metaText: metaText.trim() || 'Today',
      completed: false,
      course: category === 'academic' ? course : undefined,
      priority,
      notes: notes.trim(),
      estimatedMinutes,
    });

    setTitle('');
    setNotes('');
    onClose();
  };

  const handleCategoryChange = (newCat: TaskCategory) => {
    setCategory(newCat);
    if (newCat === 'academic') {
      setMetaIcon('schedule');
      setMetaText('Due Today, 11:59 PM');
    } else if (newCat === 'personal') {
      setMetaIcon('fitness_center');
      setMetaText('1 Hour');
    } else {
      setMetaIcon('shopping_cart');
      setMetaText('List in notes');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[20px]">add_task</span>
            </span>
            <div>
              <h2 className="font-display text-lg font-bold text-zinc-900">Create New Task</h2>
              <p className="text-xs text-zinc-500">Add to your daily focus list</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-700 p-1.5 rounded-full hover:bg-zinc-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Physics Lab Report or Read Chapter 5"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-sm text-zinc-900 font-medium"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleCategoryChange('academic')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  category === 'academic'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">school</span>
                Academic
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('personal')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  category === 'personal'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">favorite</span>
                Personal
              </button>
              <button
                type="button"
                onClick={() => handleCategoryChange('errands')}
                className={`py-2 px-3 rounded-2xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  category === 'errands'
                    ? 'bg-zinc-900 border-zinc-900 text-white shadow-xs'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                Errands
              </button>
            </div>
          </div>

          {/* Course (if Academic) */}
          {category === 'academic' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Course
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-medium text-zinc-900"
                >
                  {courses.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs font-medium text-zinc-900"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority ⚠️</option>
                </select>
              </div>
            </div>
          )}

          {/* Meta Label & Icon Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Badge / Schedule Detail
              </label>
              <input
                type="text"
                value={metaText}
                onChange={(e) => setMetaText(e.target.value)}
                placeholder="e.g. Due Today, 11:59 PM"
                className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs text-zinc-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
                Icon Style
              </label>
              <select
                value={metaIcon}
                onChange={(e) => setMetaIcon(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs text-zinc-900"
              >
                <option value="schedule">Schedule (Clock)</option>
                <option value="book">Book (Reading)</option>
                <option value="fitness_center">Fitness (Gym)</option>
                <option value="shopping_cart">Shopping (Errands)</option>
                <option value="edit_note">Notes (Assignment)</option>
                <option value="laptop">Code / Lab</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1.5">
              Notes & Checklist (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add key formulas, references, or checklist details..."
              className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs text-zinc-900 resize-none"
            />
          </div>

          {/* Actions */}
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
              className="px-6 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition-all active:scale-95"
            >
              Add to Daily Focus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
