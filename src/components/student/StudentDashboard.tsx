'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PendingStudentView } from './PendingStudentView';
import { AiMentorChatbot } from './AiMentorChatbot';
import {
  Sparkles,
  Award,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
  Briefcase,
  Code2,
  Clock,
  ArrowUpRight,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { currentStudent } = useApp();
  const [completedActionIds, setCompletedActionIds] = useState<string[]>([]);

  if (!currentStudent) return null;

  // If student account is pending approval, show the Gated Onboarding Lock Screen!
  if (currentStudent.approvalStatus === 'PENDING') {
    return <PendingStudentView />;
  }

  const student = currentStudent;

  const toggleAction = (id: string) => {
    setCompletedActionIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Safe attendance calculation
  const totalEstimatedClasses = 60;
  const currentAttended = Math.round((student.attendance.overallPercentage / 100) * totalEstimatedClasses);
  const minRequiredFor75 = Math.ceil(0.75 * totalEstimatedClasses);
  const attendanceBuffer = currentAttended - minRequiredFor75;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* 1. Top Student Welcome Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg shadow-indigo-950/40"
            />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  {student.name}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {student.usn}
                </span>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Account Verified
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                {student.academic.department} • Semester {student.academic.semester}
              </p>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className={`text-[11px] px-2.5 py-0.5 rounded-lg font-bold border ${student.cohort.badgeColor}`}>
                  {student.cohort.label}
                </span>
                <span className="text-xs text-slate-400">
                  Mentor: Dr. Sharma ({student.feedback.facultySentiment === 'POSITIVE' ? 'High Standing' : 'Action Required'})
                </span>
              </div>
            </div>
          </div>

          {/* Quick Overall Success Score Pill */}
          <div className="flex items-center gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 shadow-inner">
            <div className="text-right">
              <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                Overall Success Score
              </span>
              <span className="text-xs text-slate-400">Proprietary AI Composite</span>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-2xl font-black font-mono text-indigo-300 shadow-lg">
              {student.successScore.overall}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Primary Metric Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: CGPA */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Cumulative GPA</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white font-mono">
              {student.academic.cgpa.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500">/ 10.0</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-emerald-400">
            {student.academic.cgpaDelta || '+0.28 vs Sem 5'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1">
            <span>Backlogs:</span>
            <span className={`font-bold ${student.academic.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
              {student.academic.activeBacklogs} active
            </span>
          </div>
        </div>

        {/* Metric 2: Attendance */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Overall Attendance</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-3xl font-extrabold font-mono ${
                student.attendance.overallPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {student.attendance.overallPercentage}%
            </span>
            <span className="text-xs text-slate-500">Min 75%</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-slate-300">
            {student.attendance.attendanceDelta || '-2% vs last month'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            {attendanceBuffer >= 0 ? (
              <span className="text-emerald-400 font-semibold">
                Can miss up to {attendanceBuffer} more class(es) safely
              </span>
            ) : (
              <span className="text-rose-400 font-semibold">
                Need to attend {Math.abs(attendanceBuffer)} classes consecutively
              </span>
            )}
          </div>
        </div>

        {/* Metric 3: Placement Benchmark */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Placement Readiness</span>
            <Briefcase className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-400 font-mono">
              {student.placement.codingScore}
            </span>
            <span className="text-xs text-slate-500">Coding / 100</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-cyan-400">
            {student.placement.codingDelta || '+8 pts post-bootcamp'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Mock Interview: {student.placement.mockInterviewRating}/100</span>
            <span className={`font-bold ${student.placement.placementDriveEligible ? 'text-emerald-400' : 'text-amber-400'}`}>
              {student.placement.placementDriveEligible ? 'Eligible' : 'Needs Prep'}
            </span>
          </div>
        </div>

        {/* Metric 4: LMS Velocity */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>LMS Coursework Velocity</span>
            <TrendingUp className="w-4 h-4 text-pink-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-pink-400 font-mono">
              {student.lms.assignmentCompletionRate}%
            </span>
            <span className="text-xs text-slate-500">Completion</span>
          </div>
          <div className="mt-1 text-[11px] font-bold text-pink-400">
            {student.lms.lmsDelta || '+5% assignment velocity'}
          </div>
          <div className="mt-1 text-[11px] text-slate-400">
            Logins: {student.lms.weeklyLogins}/wk • Overdue: {student.lms.overdueAssignments}
          </div>
        </div>
      </div>

      {/* 3. Core Prescriptive Intelligence & XAI Breakdown (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Left Column: AI-Driven Actionable Interventions */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Actionable Decision Intelligence
                  </h3>
                  <p className="text-xs text-slate-400">
                    Personalized high-ROI steps to boost your Success Score &amp; Career Readiness.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 my-4">
              {student.actionableInsights.map((action) => {
                const isCompleted = completedActionIds.includes(action.id);
                return (
                  <div
                    key={action.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isCompleted
                        ? 'bg-slate-900/40 border-emerald-500/40 opacity-70'
                        : 'bg-slate-800/60 border-slate-700/80 hover:border-indigo-500/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              action.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {action.priority}
                          </span>
                          <span className={`text-xs font-bold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-200'}`}>
                            {action.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {action.description}
                        </p>
                      </div>

                      <button
                        onClick={() => toggleAction(action.id)}
                        className={`flex-shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                          isCompleted
                            ? 'bg-emerald-600/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Done
                          </>
                        ) : (
                          <>+{action.expectedScoreImpact} pts</>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-[11px] text-indigo-300 flex items-center gap-2 mt-4">
            <Sparkles className="w-4 h-4 flex-shrink-0 text-indigo-400" />
            <span>
              Completing these recommended modules directly updates your continuous assessment weights in the next audit cycle.
            </span>
          </div>
        </div>

        {/* Right Column: Explainable AI "Why This Score?" */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Explainable AI: &quot;Why This Score?&quot;
              </h3>
              <p className="text-xs text-slate-400">
                Transparent feature contributions driving your current rating ({student.successScore.overall}/100).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Positive Drivers */}
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5" /> What&apos;s Helping Your Score
              </span>
              <div className="space-y-2">
                {student.xaiDrivers
                  .filter((d) => d.type === 'POSITIVE')
                  .map((driver) => (
                    <div
                      key={driver.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-emerald-500/20 text-xs flex items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-semibold text-slate-200 block">{driver.feature}</span>
                        <span className="text-[11px] text-slate-400">{driver.description}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 font-bold font-mono text-xs whitespace-nowrap">
                        +{driver.impact} pts
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Negative Drag Factors */}
            <div>
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block mb-2 flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" /> What&apos;s Lowering Your Score
              </span>
              {student.xaiDrivers.filter((d) => d.type === 'NEGATIVE').length === 0 ? (
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 italic">
                  No negative penalties detected! You are maintaining benchmark across all pillars.
                </div>
              ) : (
                <div className="space-y-2">
                  {student.xaiDrivers
                    .filter((d) => d.type === 'NEGATIVE')
                    .map((driver) => (
                      <div
                        key={driver.id}
                        className="p-3 rounded-xl bg-slate-900/80 border border-rose-500/20 text-xs flex items-center justify-between gap-3"
                      >
                        <div>
                          <span className="font-semibold text-slate-200 block">{driver.feature}</span>
                          <span className="text-[11px] text-slate-400">{driver.description}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 font-bold font-mono text-xs whitespace-nowrap">
                          {driver.impact} pts
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Unified Data Pillars 6 & 7: Skills Matrix & Faculty Sentiment Index */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pillar 6: Unified Skills Matrix */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Code2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Pillar 6: Skills Matrix Widget
                </h3>
                <p className="text-xs text-slate-400">
                  Continuous Assessment &amp; Skill Benchmarks
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Pillar 6 of 7
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Technical Skill Index
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-cyan-400 font-mono">
                  {student.skills.technicalIndex || student.skills.technicalRating}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-sm h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-1.5 rounded-sm"
                  style={{ width: `${student.skills.technicalIndex || student.skills.technicalRating}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Soft Skills / Communication
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-pink-400 font-mono">
                  {typeof student.skills.softSkillsRating === 'number' && student.skills.softSkillsRating > 5
                    ? (student.skills.softSkillsRating / 20).toFixed(1)
                    : student.skills.softSkillsRating}
                </span>
                <span className="text-xs text-slate-500 font-medium">/ 5.0</span>
              </div>
              <div className="w-full bg-slate-800 rounded-sm h-1.5 mt-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 via-rose-500 to-pink-500 h-1.5 rounded-sm"
                  style={{
                    width: `${
                      (Number(
                        typeof student.skills.softSkillsRating === 'number' && student.skills.softSkillsRating > 5
                          ? (student.skills.softSkillsRating / 20).toFixed(1)
                          : student.skills.softSkillsRating
                      ) /
                        5.0) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">Top Assessed Competencies:</span>
            <div className="flex flex-wrap gap-1.5">
              {student.skills.primarySkillset.map((c, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pillar 7: Faculty Feedback & Sentiment Widget */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-pink-500/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Pillar 7: Faculty Feedback &amp; Sentiment
                </h3>
                <p className="text-xs text-slate-400">
                  Proctorial Board Observation &amp; Institutional Tone
                </p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/30">
              Pillar 7 of 7
            </span>
          </div>

          <div className="flex items-center justify-between bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Overall Sentiment Badge
              </span>
              <span className="text-xs font-bold text-slate-200">
                Official Proctor Observation
              </span>
            </div>
            <span
              className={`px-3 py-1 rounded-md text-xs font-bold border flex items-center gap-1.5 ${
                student.feedback.facultySentiment === 'POSITIVE'
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : student.feedback.facultySentiment === 'NEUTRAL'
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  student.feedback.facultySentiment === 'POSITIVE'
                    ? 'bg-emerald-400'
                    : student.feedback.facultySentiment === 'NEUTRAL'
                    ? 'bg-amber-400'
                    : 'bg-rose-400'
                }`}
              />
              {student.feedback.facultySentiment === 'POSITIVE'
                ? 'Positive'
                : student.feedback.facultySentiment === 'NEUTRAL'
                ? 'Neutral'
                : 'Needs Attention'}
            </span>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 text-xs">
            <span className="text-[10px] uppercase font-bold text-pink-400 block mb-1">
              Recent Faculty Note:
            </span>
            <p className="text-slate-300 italic leading-relaxed">
              &ldquo;{student.feedback.recentNote || student.feedback.facultyMentorFeedback}&rdquo;
            </p>
            <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
              <span>Audited by Proctorial Board</span>
              <span className="font-mono">{student.feedback.lastMeetingDate}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. Subject Performance & Skill Radar Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject-Wise Attendance */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            Classroom Attendance Breakdown
          </h4>
          <div className="space-y-3">
            {student.attendance.subjectWise.map((sub, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">{sub.subject}</span>
                  <span className={`font-mono font-bold ${sub.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {sub.percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-800 rounded-sm overflow-hidden">
                  <div
                    className={`h-full rounded-sm ${sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${sub.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technical Skill Matrix & Verified Certifications */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Verified Technical Skill Stack
          </h4>
          <div>
            <span className="text-xs font-semibold text-slate-400 block mb-2">Competencies:</span>
            <div className="flex flex-wrap gap-2">
              {student.skills.primarySkillset.map((skill, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <span className="text-xs font-semibold text-slate-400 block mb-2">Extracurricular Accomplishments:</span>
            <div className="text-xs text-slate-300 space-y-1">
              <p>• Hackathons: {student.engagement.hackathonsCount} entered ({student.engagement.hackathonWins} wins)</p>
              <p>• Clubs: {student.engagement.activeClubs.join(', ') || 'Independent participant'}</p>
              {student.engagement.certifications.length > 0 && (
                <p>• Certifications: {student.engagement.certifications.join(', ')}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Mentor Copilot at Bottom Right */}
      <AiMentorChatbot />
    </div>
  );
};
