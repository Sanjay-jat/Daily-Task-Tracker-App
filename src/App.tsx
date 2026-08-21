/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, Task, Course, Project, ScheduleEvent } from './types';
import {
  INITIAL_TASKS,
  INITIAL_COURSES,
  INITIAL_PROJECTS,
  INITIAL_SCHEDULE,
} from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { MobileHeader } from './components/MobileHeader';
import { MobileBottomNav } from './components/MobileBottomNav';
import { DailyFocusView } from './components/DailyFocusView';
import { CalendarView } from './components/CalendarView';
import { CollegeView } from './components/CollegeView';
import { ProjectsView } from './components/ProjectsView';
import { NewTaskModal } from './components/NewTaskModal';
import { BreakModal } from './components/BreakModal';
import { SettingsModal } from './components/SettingsModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');

  // Persistent States
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('eduflow_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('eduflow_courses');
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('eduflow_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>(() => {
    const saved = localStorage.getItem('eduflow_schedule');
    return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
  });

  const [userName, setUserName] = useState<string>(() => {
    return localStorage.getItem('eduflow_username') || 'Alex Riley';
  });

  const [userRole, setUserRole] = useState<string>(() => {
    return localStorage.getItem('eduflow_role') || 'Student';
  });

  const [dailyGoal, setDailyGoal] = useState<number>(() => {
    const saved = localStorage.getItem('eduflow_goal');
    return saved ? Number(saved) : 8;
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('eduflow_sound');
    return saved !== null ? saved === 'true' : true;
  });

  // Modals
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('eduflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('eduflow_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('eduflow_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('eduflow_schedule', JSON.stringify(scheduleEvents));
  }, [scheduleEvents]);

  useEffect(() => {
    localStorage.setItem('eduflow_username', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('eduflow_role', userRole);
  }, [userRole]);

  useEffect(() => {
    localStorage.setItem('eduflow_goal', String(dailyGoal));
  }, [dailyGoal]);

  useEffect(() => {
    localStorage.setItem('eduflow_sound', String(soundEnabled));
  }, [soundEnabled]);

  // Task Handlers
  const handleToggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  // Schedule Event Handler
  const handleAddScheduleEvent = (newEventData: Omit<ScheduleEvent, 'id'>) => {
    const newEvent: ScheduleEvent = {
      ...newEventData,
      id: `sch-${Date.now()}`,
    };
    setScheduleEvents((prev) => [...prev, newEvent]);
  };

  // Project Subtask Handler
  const handleToggleSubtask = (projectId: string, subtaskId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedSubs = p.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        const completedCount = updatedSubs.filter((s) => s.completed).length;
        const progress = Math.round((completedCount / updatedSubs.length) * 100);
        return {
          ...p,
          subtasks: updatedSubs,
          progress,
          status: progress === 100 ? 'completed' : progress > 50 ? 'review' : 'in-progress',
        };
      })
    );
  };

  const handleAddProject = (newProjData: Omit<Project, 'id' | 'progress'>) => {
    const newProj: Project = {
      ...newProjData,
      id: `proj-${Date.now()}`,
      progress: 0,
    };
    setProjects((prev) => [newProj, ...prev]);
  };

  const handleResetData = () => {
    setTasks(INITIAL_TASKS);
    setCourses(INITIAL_COURSES);
    setProjects(INITIAL_PROJECTS);
    setScheduleEvents(INITIAL_SCHEDULE);
    setUserName('Alex Riley');
    setUserRole('Student');
    setDailyGoal(8);
  };

  const pendingTaskCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="bg-zinc-50 text-zinc-900 min-h-screen flex flex-col md:flex-row antialiased select-auto">
      {/* Mobile Top App Bar */}
      <MobileHeader
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        pendingTaskCount={pendingTaskCount}
      />

      {/* Desktop Fixed Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTaskCount={pendingTaskCount}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        userName={userName}
        userRole={userRole}
      />

      {/* Main Bento Content Area */}
      <main className="flex-1 md:ml-[270px] min-h-screen bg-zinc-50 p-4 sm:p-7 md:p-8 pb-28 md:pb-12 overflow-y-auto">
        {activeTab === 'home' && (
          <DailyFocusView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
            onOpenBreakModal={() => setIsBreakModalOpen(true)}
            soundEnabled={soundEnabled}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            events={scheduleEvents}
            courses={courses}
            onAddEvent={handleAddScheduleEvent}
            onOpenBreakModal={() => setIsBreakModalOpen(true)}
          />
        )}

        {activeTab === 'college' && (
          <CollegeView
            courses={courses}
            onOpenNewTaskModal={() => setIsNewTaskModalOpen(true)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            projects={projects}
            onToggleSubtask={handleToggleSubtask}
            onAddProject={handleAddProject}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTaskCount={pendingTaskCount}
      />

      {/* Mobile Floating Action Button (FAB) */}
      <button
        onClick={() => setIsNewTaskModalOpen(true)}
        className="md:hidden fixed bottom-20 right-5 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/30 flex items-center justify-center z-50 active:scale-95 transition-transform"
        aria-label="Add Task"
      >
        <span className="material-symbols-outlined text-[28px]">add</span>
      </button>

      {/* Modals */}
      <NewTaskModal
        isOpen={isNewTaskModalOpen}
        onClose={() => setIsNewTaskModalOpen(false)}
        onAddTask={handleAddTask}
        courses={courses.map((c) => ({ code: c.code, name: c.name }))}
      />

      <BreakModal
        isOpen={isBreakModalOpen}
        onClose={() => setIsBreakModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        userName={userName}
        setUserName={setUserName}
        userRole={userRole}
        setUserRole={setUserRole}
        dailyGoal={dailyGoal}
        setDailyGoal={setDailyGoal}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        onResetData={handleResetData}
      />
    </div>
  );
}
