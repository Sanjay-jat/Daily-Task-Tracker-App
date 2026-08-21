export type TaskCategory = 'academic' | 'personal' | 'errands';

export interface Task {
  id: string;
  title: string;
  category: TaskCategory;
  metaText: string;
  metaIcon: string;
  completed: boolean;
  dueDate?: string;
  course?: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  estimatedMinutes?: number;
  createdAt: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  room: string;
  schedule: string;
  color: string;
  grade: string;
  percentage: number;
  credits: number;
  upcomingExam?: {
    title: string;
    date: string;
  };
  syllabusHighlights: string[];
}

export interface Project {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  progress: number;
  status: 'planning' | 'in-progress' | 'review' | 'completed';
  category: TaskCategory;
  subtasks: { id: string; title: string; completed: boolean }[];
  description: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  course?: string;
  type: 'lecture' | 'lab' | 'study' | 'exam' | 'personal';
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
  startTime: string; // "10:00"
  endTime: string;   // "11:30"
  location: string;
  color: string;
}

export type ActiveTab = 'home' | 'calendar' | 'college' | 'projects';
