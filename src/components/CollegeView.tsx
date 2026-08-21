import React, { useState } from 'react';
import { Course } from '../types';

interface CollegeViewProps {
  courses: Course[];
  onUpdateCourseGrade?: (courseId: string, grade: string, percentage: number) => void;
  onOpenNewTaskModal: () => void;
}

export const CollegeView: React.FC<CollegeViewProps> = ({
  courses,
  onOpenNewTaskModal,
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || '');

  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const avgPercentage =
    courses.length > 0
      ? (courses.reduce((acc, c) => acc + c.percentage, 0) / courses.length).toFixed(1)
      : '0';

  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  return (
    <div className="max-w-[1240px] mx-auto space-y-5">
      {/* Top Academic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-1">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900">
              College & Academics
            </h1>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold font-mono">
              HONOR ROLL
            </span>
          </div>
          <p className="text-zinc-500 text-xs sm:text-sm mt-1">
            Fall Semester 2023 • Enrolled Courses & Academic Standings
          </p>
        </div>

        <button
          onClick={onOpenNewTaskModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-2xl font-bold text-xs hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_task</span>
          Add Course Assignment
        </button>
      </div>

      {/* Academic Highlights Bento Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-[28px] border border-zinc-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
            ★
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Cumulative GPA</div>
            <div className="font-display text-2xl font-extrabold text-zinc-900 mt-0.5">3.84 / 4.0</div>
            <div className="text-[11px] text-emerald-600 font-semibold mt-0.5">Dean's Honor List</div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-zinc-200/90 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-800 flex items-center justify-center font-bold text-lg shrink-0">
            📚
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Enrolled Courses</div>
            <div className="font-display text-2xl font-extrabold text-zinc-900 mt-0.5">{courses.length} Courses</div>
            <div className="text-[11px] text-zinc-500 font-semibold mt-0.5">{totalCredits} Total Credits</div>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-[28px] text-white shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-zinc-800 text-emerald-400 flex items-center justify-center font-bold text-lg shrink-0">
            ⚡
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Course Average</div>
            <div className="font-display text-2xl font-extrabold text-white mt-0.5">{avgPercentage}%</div>
            <div className="text-[11px] text-emerald-400 font-mono font-semibold mt-0.5">High Performance</div>
          </div>
        </div>
      </div>

      {/* Main Courses Grid & Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Course Cards List (Bento 6 cols) */}
        <div className="lg:col-span-6 bg-white border border-zinc-200/90 rounded-[32px] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Registered Curriculum
            </span>
            <span className="text-xs font-mono text-zinc-400">{courses.length} Modules</span>
          </div>

          <div className="space-y-3">
            {courses.map((course) => {
              const isSelected = selectedCourse?.id === course.id;
              return (
                <div
                  key={course.id}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`rounded-2xl p-4 border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                      : 'bg-zinc-50/70 hover:bg-white border-zinc-200/80 text-zinc-900 hover:border-zinc-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-indigo-50 text-indigo-700'
                          }`}
                        >
                          {course.code}
                        </span>
                        <span className={`text-[11px] font-medium ${isSelected ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          {course.credits} Credits
                        </span>
                      </div>
                      <h3 className={`font-bold text-sm mt-1.5 ${isSelected ? 'text-white' : 'text-zinc-900'}`}>
                        {course.name}
                      </h3>
                      <p className={`text-xs mt-1 flex items-center gap-1 ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        <span>{course.instructor}</span>
                        <span>•</span>
                        <span>{course.room}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className={`font-display text-xl font-extrabold ${isSelected ? 'text-emerald-400' : 'text-indigo-600'}`}>
                        {course.grade}
                      </div>
                      <div className={`text-xs font-mono font-semibold ${isSelected ? 'text-zinc-400' : 'text-zinc-500'}`}>
                        {course.percentage}%
                      </div>
                    </div>
                  </div>

                  {/* Mini Progress Bar */}
                  <div className={`mt-3 w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-zinc-800' : 'bg-zinc-200'}`}>
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-emerald-400' : 'bg-indigo-600'}`}
                      style={{ width: `${course.percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Course Deep Dive (Bento 6 cols) */}
        <div className="lg:col-span-6">
          {selectedCourse ? (
            <div className="bg-white rounded-[32px] p-6 sm:p-7 border border-zinc-200/90 shadow-xs space-y-5 sticky top-6">
              <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 font-mono inline-block mb-1.5">
                    {selectedCourse.code} Module
                  </span>
                  <h3 className="font-display text-xl font-bold text-zinc-900">
                    {selectedCourse.name}
                  </h3>
                  <div className="text-xs text-zinc-500 mt-1">
                    Faculty: <strong className="text-zinc-900">{selectedCourse.instructor}</strong>
                  </div>
                </div>
                <div className="p-3 bg-zinc-50 border border-zinc-200/70 rounded-2xl text-center">
                  <div className="text-[10px] font-bold uppercase text-zinc-400">Current Grade</div>
                  <div className="font-display text-2xl font-black text-indigo-600">
                    {selectedCourse.grade}
                  </div>
                </div>
              </div>

              {/* Schedule & Location Bento pair */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">schedule</span>
                    Timetable
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 mt-1 font-mono">{selectedCourse.schedule}</div>
                </div>
                <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200/70">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-indigo-600">location_on</span>
                    Classroom
                  </div>
                  <div className="text-xs font-semibold text-zinc-900 mt-1">{selectedCourse.room}</div>
                </div>
              </div>

              {/* Upcoming Exam Highlight */}
              {selectedCourse.upcomingExam && (
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/70 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-amber-700 text-[22px]">event_note</span>
                    <div>
                      <div className="text-xs font-bold text-amber-950">
                        {selectedCourse.upcomingExam.title}
                      </div>
                      <div className="text-[11px] text-amber-800 font-medium font-mono">
                        Date: {selectedCourse.upcomingExam.date}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-amber-700 bg-white border border-amber-200 px-2.5 py-1 rounded-xl shadow-2xs">
                    Exam
                  </span>
                </div>
              )}

              {/* Syllabus Highlights */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2.5">
                  Core Topics
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedCourse.syllabusHighlights.map((topic, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-zinc-50 rounded-xl text-xs text-zinc-800 font-medium border border-zinc-200/60 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      {topic}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={onOpenNewTaskModal}
                className="w-full py-2.5 rounded-2xl bg-zinc-900 text-white hover:bg-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
              >
                <span className="material-symbols-outlined text-[16px]">add_task</span>
                Add Study Task for {selectedCourse.code}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
