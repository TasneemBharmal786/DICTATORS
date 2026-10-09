'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  Lock,
  Clock,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  School,
  Mail,
  RefreshCw,
} from 'lucide-react';

export const PendingStudentView: React.FC = () => {
  const { currentStudent, setRole, approveStudent } = useApp();

  if (!currentStudent) return null;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-fadeIn">
      {/* Gated Card */}
      <div className="glass-panel rounded-3xl border border-amber-500/30 bg-slate-900/90 shadow-2xl shadow-amber-950/20 overflow-hidden text-center p-8 sm:p-12 relative">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Lock Icon */}
        <div className="mx-auto w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-inner relative">
          <Lock className="w-10 h-10 text-amber-400 animate-pulse" />
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 uppercase tracking-wider">
            GATED
          </span>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Account Verification in Progress
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-lg mx-auto">
          Welcome, <span className="font-bold text-amber-300">{currentStudent.name}</span>. Your registration has been received and is currently in the faculty gatekeeper approval queue.
        </p>

        {/* Gated Workflow Stepper */}
        <div className="my-8 max-w-xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
          {/* Step 1 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/80 border border-emerald-500/30">
            <div className="flex items-center gap-2 mb-1.5 text-emerald-400">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 1: Submitted</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Registration &amp; academic records synced.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-2xl bg-amber-950/30 border border-amber-500/40">
            <div className="flex items-center gap-2 mb-1.5 text-amber-400">
              <Clock className="w-4 h-4 flex-shrink-0 animate-spin" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 2: Review</span>
            </div>
            <p className="text-[11px] text-slate-300">
              Awaiting Dr. Sharma&apos;s authorization.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-slate-700/60 opacity-60">
            <div className="flex items-center gap-2 mb-1.5 text-slate-400">
              <Lock className="w-4 h-4 flex-shrink-0" />
              <span className="text-xs font-bold uppercase tracking-wider">Step 3: Unlocked</span>
            </div>
            <p className="text-[11px] text-slate-500">
              Full AI Success Score &amp; Insights access.
            </p>
          </div>
        </div>

        {/* Student Meta Details */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 max-w-md mx-auto text-xs text-left mb-8 space-y-1.5">
          <div className="flex justify-between">
            <span className="text-slate-400">Student ID / USN:</span>
            <span className="font-mono font-bold text-slate-200">{currentStudent.usn}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Department:</span>
            <span className="font-semibold text-slate-200">{currentStudent.academic.department}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Submission Timestamp:</span>
            <span className="text-slate-400">{currentStudent.requestedAt}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Security State:</span>
            <span className="font-bold text-amber-400">ACCESS_RESTRICTED (PENDING)</span>
          </div>
        </div>

        {/* Live Demo Callout For Judges */}
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 text-xs text-left max-w-lg mx-auto flex items-start gap-3 mb-6">
          <Sparkles className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-indigo-300 block mb-0.5">
              Live Hackathon Demonstration Note:
            </span>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              To test the gated onboarding flow right now, click <strong>&quot;Faculty Admin (Dr. Sharma)&quot;</strong> in the top switcher bar, click <strong>&quot;Approve Access&quot;</strong> on Rahul&apos;s request, and switch back. This view will dynamically unlock his Student Dashboard.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => setRole('ADMIN')}
                className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] transition-colors"
              >
                Go to Admin Console →
              </button>
              <button
                onClick={() => approveStudent(currentStudent.id)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-[11px] transition-colors"
              >
                Or 1-Click Fast Approve Here
              </button>
            </div>
          </div>
        </div>

        {/* Footer Support Info */}
        <div className="text-[11px] text-slate-500 flex items-center justify-center gap-4">
          <span className="flex items-center gap-1">
            <School className="w-3.5 h-3.5" /> RV College of Engineering
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Mail className="w-3.5 h-3.5" /> dean.academics@rvce.edu.in
          </span>
        </div>
      </div>
    </div>
  );
};
