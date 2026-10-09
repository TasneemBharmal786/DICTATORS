'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Lock,
} from 'lucide-react';

export const PendingApprovalsWidget: React.FC = () => {
  const {
    pendingStudents,
    approveStudent,
    rejectStudent,
    setSelectedMicroStudent,
    setActiveStudentId,
    setRole,
  } = useApp();

  const [recentAction, setRecentAction] = useState<string | null>(null);

  const handleApprove = (id: string, name: string) => {
    approveStudent(id);
    setRecentAction(`Approved access for ${name}. Their portal is now unlocked!`);
    setTimeout(() => setRecentAction(null), 5000);
  };

  const handleReject = (id: string, name: string) => {
    rejectStudent(id);
    setRecentAction(`Rejected access request for ${name}.`);
    setTimeout(() => setRecentAction(null), 5000);
  };

  return (
    <div className="relative overflow-hidden rounded-2xl glass-panel border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900/60 to-slate-900 shadow-xl shadow-amber-950/10 mb-8">
      {/* Decorative top border highlight */}
      <div className="h-1 w-full bg-gradient-to-r from-amber-500 via-orange-400 to-indigo-500" />

      <div className="p-5 sm:p-6">
        {/* Header Section */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                  Gated Onboarding: Pending Student Access Requests
                </h2>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {pendingStudents.length} Awaiting Verification
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                First-time student registrations remain locked in &quot;Pending&quot; state until verified by Faculty Administration.
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-[11px] font-mono text-slate-400 block">
              Authorization Protocol: <span className="text-amber-400 font-semibold">Dual-Interface Gated Gatekeeper</span>
            </span>
            <span className="text-[10px] text-slate-500">
              Live updates propagate instantly via synchronized state
            </span>
          </div>
        </div>

        {/* Live Feedback Toast */}
        {recentAction && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{recentAction}</span>
            </div>
            <button
              onClick={() => setRecentAction(null)}
              className="text-emerald-400 hover:text-white font-bold ml-4"
            >
              X
            </button>
          </div>
        )}

        {/* Pending Requests Content */}
        {pendingStudents.length === 0 ? (
          <div className="py-8 px-4 text-center rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="inline-flex h-12 w-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center text-emerald-400 mb-2">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-semibold text-slate-200">
              All Student Registrations Approved &amp; Verified
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              There are currently no new student onboarding requests pending in the queue. You can reset demo data at any time from the top bar to re-test the onboarding gatekeeper.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingStudents.map((student) => (
              <div
                key={student.id}
                className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 hover:border-amber-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Student Quick Meta */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={student.avatarUrl}
                        alt={student.name}
                        className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/30"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          {student.name}
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-300 font-mono">
                            {student.usn}
                          </span>
                        </h4>
                        <p className="text-xs text-slate-400">
                          {student.academic.department} • Sem {student.academic.semester}
                        </p>
                      </div>
                    </div>

                    <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-900/60 px-2 py-1 rounded-md border border-slate-800">
                      <Clock className="w-3 h-3 text-amber-400" />
                      {student.requestedAt}
                    </span>
                  </div>

                  {/* Academic Snapshot */}
                  <div className="grid grid-cols-3 gap-2 my-3 p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">CGPA</span>
                      <span className="text-xs font-bold text-slate-200">
                        {student.academic.cgpa.toFixed(2)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Attendance</span>
                      <span
                        className={`text-xs font-bold ${
                          student.attendance.overallPercentage >= 75
                            ? 'text-emerald-400'
                            : 'text-amber-400'
                        }`}
                      >
                        {student.attendance.overallPercentage}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Pre-Audit Score</span>
                      <span className="text-xs font-bold text-indigo-400">
                        {student.successScore.overall}/100
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 italic line-clamp-1 mb-4">
                    &quot;{student.feedback.facultyMentorFeedback}&quot;
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-700/60">
                  <button
                    onClick={() => handleApprove(student.id, student.name)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-950 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Approve Access
                  </button>

                  <button
                    onClick={() => handleReject(student.id, student.name)}
                    className="flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-rose-950/50 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 text-xs font-semibold transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    Reject
                  </button>

                  <button
                    onClick={() => setSelectedMicroStudent(student)}
                    title="Inspect 360° Profile"
                    className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
