import React, { useState } from 'react';
import { Project, TaskCategory } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onToggleSubtask: (projectId: string, subtaskId: string) => void;
  onAddProject: (project: Omit<Project, 'id' | 'progress'>) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  onToggleSubtask,
  onAddProject,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('PHYS 201');
  const [newDueDate, setNewDueDate] = useState('Nov 15, 2023');
  const [newDescription, setNewDescription] = useState('');

  const filteredProjects = projects.filter((p) => {
    if (selectedStatus === 'all') return true;
    return p.status === selectedStatus;
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddProject({
      title: newTitle.trim(),
      course: newCourse,
      dueDate: newDueDate,
      status: 'in-progress',
      category: 'academic',
      description: newDescription.trim() || 'Key deliverable and milestone tracking.',
      subtasks: [
        { id: `sub-${Date.now()}-1`, title: 'Initial research & outline', completed: true },
        { id: `sub-${Date.now()}-2`, title: 'Draft core deliverable', completed: false },
        { id: `sub-${Date.now()}-3`, title: 'Final review & submission', completed: false },
      ],
    });

    setNewTitle('');
    setNewDescription('');
    setIsNewProjectModalOpen(false);
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              Projects & Assignments
            </h1>
            <span className="px-3 py-1 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full text-xs font-bold font-mono">
              ACTIVE SPRINTS
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Major deliverables, lab reports, and term research papers
          </p>
        </div>

        <button
          onClick={() => setIsNewProjectModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          New Project
        </button>
      </div>

      {/* Filter Tabs in Bento Pill Group */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'all', label: 'All Deliverables' },
          { id: 'in-progress', label: 'In Progress' },
          { id: 'review', label: 'In Review' },
          { id: 'planning', label: 'Planning' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatus(tab.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all shrink-0 ${
              selectedStatus === tab.id
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Project Bento Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredProjects.map((project) => {
          const completedCount = project.subtasks.filter((s) => s.completed).length;
          const totalCount = project.subtasks.length;
          const calculatedProgress =
            totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : project.progress;

          return (
            <div
              key={project.id}
              className="bg-white rounded-[32px] p-6 sm:p-7 border border-zinc-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono">
                      {project.course}
                    </span>
                    <span className="text-xs text-zinc-500 font-medium flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-zinc-400">event</span>
                      Due: {project.dueDate}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                      project.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : project.status === 'review'
                        ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : project.status === 'in-progress'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-zinc-100 text-zinc-700 border-zinc-200'
                    }`}
                  >
                    {project.status.replace('-', ' ')}
                  </span>
                </div>

                <h3 className="font-display text-lg font-bold text-zinc-900 mt-3">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{project.description}</p>
              </div>

              {/* Progress & Subtasks */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-zinc-500">
                    Milestones: {completedCount}/{totalCount} Completed
                  </span>
                  <span className="font-bold text-indigo-600 font-mono">{calculatedProgress}%</span>
                </div>

                <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${calculatedProgress}%` }}
                  ></div>
                </div>

                {/* Subtask checklist */}
                <div className="pt-3 space-y-2 border-t border-zinc-100">
                  {project.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => onToggleSubtask(project.id, sub.id)}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-zinc-50 cursor-pointer transition-colors border border-transparent hover:border-zinc-200/60"
                    >
                      <button
                        type="button"
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          sub.completed
                            ? 'bg-zinc-900 border-zinc-900 text-white'
                            : 'border-zinc-300 bg-white'
                        }`}
                      >
                        {sub.completed && (
                          <span className="material-symbols-outlined text-[12px] font-bold">
                            check
                          </span>
                        )}
                      </button>
                      <span
                        className={`text-xs text-zinc-800 font-medium ${
                          sub.completed ? 'line-through text-zinc-400' : ''
                        }`}
                      >
                        {sub.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isNewProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-[32px] w-full max-w-md p-6 sm:p-7 shadow-2xl border border-zinc-200">
            <h3 className="font-display text-xl font-bold text-zinc-900 mb-4">Create New Project</h3>
            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Modern Physics Lab Report"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs font-mono focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                    Due Date
                  </label>
                  <input
                    type="text"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Scope, requirements, or lab partners..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border border-zinc-200 text-xs text-zinc-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setIsNewProjectModalOpen(false)}
                  className="px-4 py-2.5 rounded-2xl border border-zinc-200 text-xs font-bold text-zinc-600 hover:bg-zinc-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-2xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 shadow-md shadow-indigo-600/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
