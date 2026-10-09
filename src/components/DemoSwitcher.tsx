'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { ShieldCheck, UserCheck, Clock, RotateCcw, Sparkles, Lock } from 'lucide-react';

export const DemoSwitcher: React.FC = () => {
  const {
    role,
    setRole,
    isLoggedOut,
    setIsLoggedOut,
    activeStudentId,
    setActiveStudentId,
    pendingStudents,
    resetDemoData,
    students,
  } = useApp();

  const rahul = students.find((s) => s.id === 'stu-001');
  const priya = students.find((s) => s.id === 'stu-002');

  return (
    <div className="bg-gradient-to-r from-slate-950 via-indigo-950/80 to-slate-950 border-b border-indigo-500/20 px-4 py-2.5 text-xs text-slate-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Hackathon Presenter Label */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          <span className="font-semibold text-indigo-300 tracking-wide uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Hackathon Live Demo Switcher
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
          <span className="hidden md:inline text-slate-400">
            Instant Persona Toggle:
          </span>
        </div>

        {/* Center: Persona Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-lg border border-slate-700/60 shadow-inner">
          {/* Admin Role */}
          <button
            onClick={() => {
              setIsLoggedOut(false);
              setRole('ADMIN');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              !isLoggedOut && role === 'ADMIN'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-300" />
            <span>Faculty Admin (Dr. Sharma)</span>
            {pendingStudents.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-amber-500 text-slate-950 rounded-md font-bold text-[10px]">
                {pendingStudents.length}
              </span>
            )}
          </button>

          {/* Pending Student: Rahul Verma */}
          <button
            onClick={() => {
              setIsLoggedOut(false);
              setRole('STUDENT');
              setActiveStudentId('stu-001');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              !isLoggedOut && role === 'STUDENT' && activeStudentId === 'stu-001'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-300" />
            <span>Rahul Verma</span>
            <span
              className={`ml-1 px-1.5 py-0.2 rounded-md font-bold text-[10px] ${
                rahul?.approvalStatus === 'APPROVED'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
            >
              {rahul?.approvalStatus === 'APPROVED' ? 'UNLOCKED' : 'PENDING'}
            </span>
          </button>

          {/* Approved Student: Priya Nair */}
          <button
            onClick={() => {
              setIsLoggedOut(false);
              setRole('STUDENT');
              setActiveStudentId('stu-002');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
              !isLoggedOut && role === 'STUDENT' && activeStudentId === 'stu-002'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-emerald-300" />
            <span>Priya Nair (Star Performer)</span>
            <span className="ml-1 px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md font-bold text-[10px]">
              APPROVED
            </span>
          </button>

          {/* Open Dedicated Login Page */}
          <button
            onClick={() => setIsLoggedOut(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all border border-dashed ${
              isLoggedOut
                ? 'bg-indigo-700 text-white border-white'
                : 'text-indigo-300 hover:text-white border-indigo-500/40 hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-indigo-300" />
            <span>Open Login Page</span>
          </button>
        </div>

        {/* Right: Reset Demo State */}
        <button
          onClick={() => {
            setIsLoggedOut(false);
            resetDemoData();
          }}
          title="Reset back to initial seed state"
          className="flex items-center gap-1 text-slate-400 hover:text-rose-300 transition-colors px-2 py-1 hover:bg-slate-800 rounded"
        >
          <RotateCcw className="w-3 h-3" />
          <span className="hidden sm:inline">Reset Demo</span>
        </button>
      </div>
    </div>
  );
};
