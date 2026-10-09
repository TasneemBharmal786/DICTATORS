'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types/student';
import {
  X,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Briefcase,
  Activity,
  Layers,
  Award,
  HelpCircle,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  UserCheck,
  Calendar,
} from 'lucide-react';

export const StudentDetailModal: React.FC = () => {
  const {
    selectedMicroStudent,
    setSelectedMicroStudent,
    approveStudent,
    rejectStudent,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACADEMIC' | 'PLACEMENT' | 'LMS' | 'XAI'>('OVERVIEW');

  if (!selectedMicroStudent) return null;

  const student = selectedMicroStudent;

  const handleApprove = () => {
    approveStudent(student.id);
  };

  const handleReject = () => {
    rejectStudent(student.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl rounded-3xl glass-panel border border-slate-700/80 bg-slate-900/95 shadow-2xl shadow-indigo-950/50 my-8 overflow-hidden text-slate-100">
        
        {/* Top Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-600" />

        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-md"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {student.name}
                </h2>
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {student.usn}
                </span>
                {student.approvalStatus === 'APPROVED' ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Approved
                  </span>
                ) : student.approvalStatus === 'PENDING' ? (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Awaiting Approval
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/30">
                    Rejected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {student.academic.department} • Semester {student.academic.semester} • Admission Year {student.admissionYear}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* If pending, show fast action buttons directly in header */}
            {student.approvalStatus === 'PENDING' && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleApprove}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-colors"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Approve Account
                </button>
                <button
                  onClick={handleReject}
                  className="px-3 py-1.5 rounded-xl bg-rose-950/60 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-medium transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            )}

            <button
              onClick={() => setSelectedMicroStudent(null)}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
          {[
            { id: 'OVERVIEW', label: '360° Overview' },
            { id: 'XAI', label: 'Explainable AI ("Why This Score?")' },
            { id: 'ACADEMIC', label: 'Academics & Attendance' },
            { id: 'PLACEMENT', label: 'Placement & Skills' },
            { id: 'LMS', label: 'LMS & Campus Life' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 font-semibold transition-all relative ${
                activeTab === tab.id
                  ? 'text-indigo-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-none" />
              )}
            </button>
          ))}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">

          {/* TAB: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Score & Risk KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Proprietary Success Score */}
                <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-slate-800/60 to-slate-800/30 border border-indigo-500/30 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider block">
                      Student Success Score
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                        {student.successScore.overall}
                      </span>
                      <span className="text-xs text-slate-400">/ 100</span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-2">
                      Weighted multi-pillar algorithm
                    </span>
                  </div>
                  <div className="h-16 w-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>

                {/* 2. Dual Risk Categorization */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Dual-Axis Risk Evaluation
                  </span>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Academic Risk:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          student.risk.academicRisk === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300'
                            : student.risk.academicRisk === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {student.risk.academicRisk}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Placement Risk:</span>
                      <span
                        className={`font-bold px-2 py-0.5 rounded ${
                          student.risk.placementRisk === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300'
                            : student.risk.placementRisk === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {student.risk.placementRisk}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-2 line-clamp-1">
                    {student.risk.primaryRiskReason}
                  </p>
                </div>

                {/* 3. Actionable Cohort */}
                <div className="p-5 rounded-2xl bg-slate-800/40 border border-slate-700/80">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Actionable Cohort Segment
                  </span>
                  <span
                    className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${student.cohort.badgeColor}`}
                  >
                    {student.cohort.label}
                  </span>
                  <p className="text-xs text-slate-400 mt-2">
                    {student.cohort.description}
                  </p>
                </div>
              </div>

              {/* 5-Pillar Score Weights Breakdown */}
              <div className="p-5 rounded-2xl bg-slate-800/30 border border-slate-700/60">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-4">
                  Multi-Pillar Score Components
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Academic (30%)</span>
                    <span className="text-lg font-bold text-indigo-400 font-mono">
                      {student.successScore.academicPillar}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Placement (25%)</span>
                    <span className="text-lg font-bold text-cyan-400 font-mono">
                      {student.successScore.placementPillar}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Attendance &amp; LMS (20%)</span>
                    <span className="text-lg font-bold text-emerald-400 font-mono">
                      {student.successScore.engagementLmsPillar}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Skills Matrix (15%)</span>
                    <span className="text-lg font-bold text-pink-400 font-mono">
                      {student.successScore.skillsPillar}
                    </span>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Campus Life (10%)</span>
                    <span className="text-lg font-bold text-amber-400 font-mono">
                      {student.successScore.campusLifePillar}
                    </span>
                  </div>
                </div>

                {student.successScore.backlogPenalty > 0 && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300 flex items-center justify-between">
                    <span>Backlog Penalty Applied:</span>
                    <span className="font-bold font-mono">
                      -{student.successScore.backlogPenalty} pts ({student.academic.activeBacklogs} backlogs)
                    </span>
                  </div>
                )}
              </div>

              {/* Quick AI Prescriptive Intervention Preview */}
              <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-500/20">
                <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  Prescriptive Decision Intelligence: Recommended Interventions
                </h4>
                <div className="space-y-2.5">
                  {student.actionableInsights.map((action) => (
                    <div
                      key={action.id}
                      className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start justify-between gap-3 text-xs"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              action.priority === 'HIGH'
                                ? 'bg-rose-500/20 text-rose-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {action.priority} PRIORITY
                          </span>
                          <span className="font-bold text-slate-200">{action.title}</span>
                        </div>
                        <p className="text-slate-400 mt-1">{action.description}</p>
                      </div>
                      <span className="px-2 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 font-bold whitespace-nowrap">
                        +{action.expectedScoreImpact} Score Impact
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: XAI (EXPLAINABLE AI) */}
          {activeTab === 'XAI' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  Explainable AI (XAI) Attribution Breakdown
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  SHAP-inspired feature impact values demonstrating exactly which factors positively boosted or dragged {student.name}&apos;s Student Success Score.
                </p>
              </div>

              {/* Drivers Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Positive Contributors */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowUp className="w-4 h-4" />
                    Positive Drivers (+ Impact Points)
                  </h5>
                  {student.xaiDrivers
                    .filter((d) => d.type === 'POSITIVE')
                    .map((driver) => (
                      <div
                        key={driver.id}
                        className="p-3.5 rounded-xl bg-slate-900 border border-emerald-500/20 space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-200">
                            {driver.feature}
                          </span>
                          <span className="text-xs font-extrabold text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                            +{driver.impact} pts
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400">
                          {driver.description}
                        </p>
                        <span className="inline-block text-[10px] text-slate-500 font-mono">
                          Pillar: {driver.pillar}
                        </span>
                      </div>
                    ))}
                </div>

                {/* Negative Drag Factors */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowDown className="w-4 h-4" />
                    Negative Drag Factors (- Impact Points)
                  </h5>
                  {student.xaiDrivers.filter((d) => d.type === 'NEGATIVE').length === 0 ? (
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 italic">
                      Zero negative penalties or drag factors detected on this profile.
                    </div>
                  ) : (
                    student.xaiDrivers
                      .filter((d) => d.type === 'NEGATIVE')
                      .map((driver) => (
                        <div
                          key={driver.id}
                          className="p-3.5 rounded-xl bg-slate-900 border border-rose-500/20 space-y-1.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs text-slate-200">
                              {driver.feature}
                            </span>
                            <span className="text-xs font-extrabold text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded">
                              {driver.impact} pts
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400">
                            {driver.description}
                          </p>
                          <span className="inline-block text-[10px] text-slate-500 font-mono">
                            Pillar: {driver.pillar}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ACADEMIC & ATTENDANCE */}
          {activeTab === 'ACADEMIC' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cumulative GPA</span>
                  <span className="text-2xl font-bold text-white font-mono mt-1 block">
                    {student.academic.cgpa.toFixed(2)} / 10.0
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Backlogs</span>
                  <span
                    className={`text-2xl font-bold font-mono mt-1 block ${
                      student.academic.activeBacklogs > 0 ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {student.academic.activeBacklogs}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overall Attendance</span>
                  <span
                    className={`text-2xl font-bold font-mono mt-1 block ${
                      student.attendance.overallPercentage >= 75 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {student.attendance.overallPercentage}%
                  </span>
                </div>
              </div>

              {/* Subject-Wise Attendance Breakdown */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">
                  Subject-Wise Attendance Health
                </h5>
                <div className="space-y-3">
                  {student.attendance.subjectWise.map((sub, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">{sub.subject}</span>
                        <span
                          className={`font-mono font-bold ${
                            sub.percentage >= 75 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {sub.percentage}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-sm overflow-hidden">
                        <div
                          className={`h-full rounded-sm ${
                            sub.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${sub.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: PLACEMENT & SKILLS */}
          {activeTab === 'PLACEMENT' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Coding Benchmark</span>
                  <span className="text-2xl font-bold text-indigo-400 font-mono mt-1 block">
                    {student.placement.codingScore}/100
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aptitude Score</span>
                  <span className="text-2xl font-bold text-cyan-400 font-mono mt-1 block">
                    {student.placement.aptitudeScore}/100
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Mock Interview Rating</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
                    {student.placement.mockInterviewRating}/100
                  </span>
                </div>
              </div>

              {/* Skills Tags */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-slate-300 block mb-2">Verified Skillset:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.skills.primarySkillset.map((skill, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {student.skills.skillGaps.length > 0 && (
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-xs font-semibold text-amber-400 block mb-2">Identified Skill Gaps:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {student.skills.skillGaps.map((gap, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                          {gap}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: LMS & CAMPUS LIFE */}
          {activeTab === 'LMS' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Weekly LMS Logins</span>
                  <span className="text-2xl font-bold text-white font-mono mt-1 block">
                    {student.lms.weeklyLogins}
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Assignment Completion</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
                    {student.lms.assignmentCompletionRate}%
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase font-semibold block">Overdue Modules</span>
                  <span className={`text-2xl font-bold font-mono mt-1 block ${student.lms.overdueAssignments > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                    {student.lms.overdueAssignments}
                  </span>
                </div>
              </div>

              {/* Extracurriculars */}
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
                <h5 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Campus Engagement &amp; Hackathons
                </h5>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>• Hackathons Competed: <span className="font-bold text-white">{student.engagement.hackathonsCount}</span> (Wins: <span className="font-bold text-emerald-400">{student.engagement.hackathonWins}</span>)</p>
                  <p>• Active Clubs: <span className="text-slate-400">{student.engagement.activeClubs.join(', ') || 'None recorded'}</span></p>
                  <p>• Certifications: <span className="text-slate-400">{student.engagement.certifications.join(', ') || 'None recorded'}</span></p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-500" />
            <span>Faculty Observation: &quot;{student.feedback.facultyMentorFeedback}&quot;</span>
          </div>

          <button
            onClick={() => setSelectedMicroStudent(null)}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Profile
          </button>
        </div>

      </div>
    </div>
  );
};
