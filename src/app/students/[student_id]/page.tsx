'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  ArrowLeft,
  GraduationCap,
  CalendarCheck,
  Laptop,
  Briefcase,
  Award,
  Sparkles,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  Mail,
  User,
  ShieldCheck,
  AlertTriangle,
  FileSpreadsheet,
} from 'lucide-react';

export default function ConsolidatedStudentProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { students } = useApp();

  const studentId = params?.student_id as string;

  // Match by id or usn (case insensitive)
  const student = students.find(
    (s) => s.id === studentId || s.usn.toLowerCase() === studentId?.toLowerCase()
  );

  const [activeTab, setActiveTab] = useState<
    'ACADEMIC' | 'ATTENDANCE' | 'LMS' | 'PLACEMENT' | 'SKILLS' | 'ENGAGEMENT' | 'FEEDBACK'
  >('ACADEMIC');

  const [expandSubjects, setExpandSubjects] = useState(false);

  if (!student) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
          <XCircle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Student Record Not Found</h1>
        <p className="text-sm text-slate-500">
          No student in the master repository matches identifier &ldquo;{studentId}&rdquo;.
        </p>
        <Link
          href="/students"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Student Directory
        </Link>
      </div>
    );
  }

  // Source coverage status helpers
  const coverage = student.sourceCoverage || {
    academic: { available: true, lastUpdated: '09 Oct 2026, 09:30 AM' },
    attendance: { available: true, lastUpdated: '09 Oct 2026, 11:15 AM' },
    lms: { available: true, lastUpdated: '09 Oct 2026, 01:20 PM' },
    placement: { available: true, lastUpdated: '09 Oct 2026, 02:45 PM' },
    skills: { available: true, lastUpdated: '09 Oct 2026, 03:10 PM' },
    engagement: { available: true, lastUpdated: '09 Oct 2026, 04:00 PM' },
    feedback: { available: true, lastUpdated: '09 Oct 2026, 04:30 PM' },
  };

  const sourcesList = [
    { key: 'academic', label: 'Academic', icon: GraduationCap, tab: 'ACADEMIC' as const },
    { key: 'attendance', label: 'Attendance', icon: CalendarCheck, tab: 'ATTENDANCE' as const },
    { key: 'lms', label: 'LMS Activity', icon: Laptop, tab: 'LMS' as const },
    { key: 'placement', label: 'Placement', icon: Briefcase, tab: 'PLACEMENT' as const },
    { key: 'skills', label: 'Skills', icon: Award, tab: 'SKILLS' as const },
    { key: 'engagement', label: 'Engagement', icon: Sparkles, tab: 'ENGAGEMENT' as const },
    { key: 'feedback', label: 'Feedback', icon: MessageSquare, tab: 'FEEDBACK' as const },
  ];

  return (
    <div className="space-y-6 animate-fadeIn max-w-7xl mx-auto">
      {/* Navigation header */}
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-rose-600 transition group"
        >
          <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-rose-600 transition" />
          <span>Back to Unified Student Repository</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/admin/data-upload"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-rose-600" />
            <span>Upload Updates</span>
          </Link>
        </div>
      </div>

      {/* Profile Overview Card (Page 7 PDF spec) */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 bg-white shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <img
              src={student.avatarUrl}
              alt={student.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-rose-500/20 shadow-md"
            />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {student.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-300">
                  {student.usn}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {student.approvalStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                <span className="font-semibold text-slate-800">{student.academic.department}</span>
                <span>•</span>
                <span className="font-mono font-bold">Semester {student.academic.semester}</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-slate-500">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Pillar Summary */}
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 self-start sm:self-auto">
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">CGPA</div>
              <div className="text-xl font-black text-slate-900">
                {student.academic.cgpa ? student.academic.cgpa.toFixed(2) : '—'}
              </div>
            </div>
            <div className="text-center px-3 border-r border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-500">Attendance</div>
              <div className="text-xl font-black text-emerald-700">
                {student.attendance.overallPercentage}%
              </div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] uppercase font-bold text-slate-500">Coding</div>
              <div className="text-xl font-black text-slate-900">
                {student.placement.codingScore}/100
              </div>
            </div>
          </div>
        </div>

        {/* Source Coverage Status Strip (Page 7 PDF spec) */}
        <div className="pt-4 border-t border-slate-200">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Multi-Source Ingestion Coverage &amp; Freshness:</span>
            <span className="text-[11px] font-normal normal-case text-slate-400">
              Keyed strictly by Student ID ({student.usn})
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {sourcesList.map((src) => {
              const info = (coverage as any)[src.key];
              const isAvailable = info?.available ?? true;
              const Icon = src.icon;

              return (
                <div
                  key={src.key}
                  className={`p-2.5 rounded-xl border flex flex-col justify-between text-left ${
                    isAvailable
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Icon className={`w-3.5 h-3.5 ${isAvailable ? 'text-emerald-600' : 'text-slate-400'}`} />
                    {isAvailable ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </div>
                  <div className="mt-1.5">
                    <div className="text-xs font-bold leading-tight">{src.label}</div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">
                      {isAvailable ? info?.lastUpdated || 'Available' : 'Missing'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-300">
        {sourcesList.map((src) => {
          const isSelected = activeTab === src.tab;
          const Icon = src.icon;

          return (
            <button
              key={src.tab}
              onClick={() => setActiveTab(src.tab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                isSelected
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{src.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-300 bg-white shadow-sm">
        {/* 1. Academic Tab */}
        {activeTab === 'ACADEMIC' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-rose-600" />
                  Academic Performance &amp; Arrears
                </h3>
                <p className="text-xs text-slate-500">
                  Sourced from Academic ERP. Last updated: {coverage.academic?.lastUpdated || 'Recent'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Cumulative GPA</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {student.academic.cgpa ? student.academic.cgpa.toFixed(2) : '—'} / 10.0
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Scale: 0.00 – 10.00</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Active Backlogs</span>
                <div className={`text-2xl font-black mt-1 ${
                  student.academic.activeBacklogs > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {student.academic.activeBacklogs}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  {student.academic.activeBacklogs > 0
                    ? `Penalty applied: -${student.academic.activeBacklogs * 8} pts`
                    : 'Zero course arrears'}
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Semester</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  Sem {student.academic.semester}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">{student.academic.department}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Subject Average</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {student.academic.topSubjects.length > 0
                    ? Math.round(
                        student.academic.topSubjects.reduce((a, b) => a + b.score, 0) /
                          student.academic.topSubjects.length
                      )
                    : 85}
                  %
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Internal marks average</div>
              </div>
            </div>

            {/* Top Subjects Breakdown */}
            {student.academic.topSubjects.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">Course Marks Breakdown:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {student.academic.topSubjects.map((sub, i) => (
                    <div key={i} className="p-3 rounded-xl border border-slate-200 bg-white flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-800">{sub.name}</span>
                      <span className="font-mono font-bold text-rose-600">{sub.score}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. Attendance Tab */}
        {activeTab === 'ATTENDANCE' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <CalendarCheck className="w-5 h-5 text-rose-600" />
                  Classroom &amp; Biometric Attendance
                </h3>
                <p className="text-xs text-slate-500">
                  Biometric attendance logs. Last updated: {coverage.attendance?.lastUpdated || 'Recent'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Overall Attendance</span>
                <div className={`text-3xl font-black mt-1 ${
                  student.attendance.overallPercentage >= 85
                    ? 'text-emerald-700'
                    : student.attendance.overallPercentage < 75
                    ? 'text-rose-600'
                    : 'text-amber-700'
                }`}>
                  {student.attendance.overallPercentage}%
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Institutional minimum: 75%</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Absent Sessions</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {student.attendance.medicalLeavesCount}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Recorded absences this semester</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Attendance Safety Buffer</span>
                <div className="text-3xl font-black text-slate-900 mt-1">
                  {Math.max(
                    0,
                    Math.floor((student.attendance.overallPercentage - 75) * 0.6)
                  )}{' '}
                  classes
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Classes student can safely miss before hitting 75%
                </div>
              </div>
            </div>

            {/* Subject-wise Attendance */}
            {student.attendance.subjectWise.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-700 uppercase">Subject-Wise Attendance Breakdown:</div>
                  <button
                    onClick={() => setExpandSubjects(!expandSubjects)}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    {expandSubjects ? 'Collapse' : 'Expand All'}
                    {expandSubjects ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {student.attendance.subjectWise
                    .slice(0, expandSubjects ? undefined : 4)
                    .map((sub, i) => (
                      <div key={i} className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-bold text-slate-800">{sub.subject}</span>
                          <span className="font-mono font-bold text-slate-900">{sub.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              sub.percentage >= 85
                                ? 'bg-emerald-500'
                                : sub.percentage < 75
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${sub.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 3. LMS Tab */}
        {activeTab === 'LMS' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Laptop className="w-5 h-5 text-rose-600" />
                LMS Activity &amp; Assignment Velocity
              </h3>
              <p className="text-xs text-slate-500">
                Canvas / Moodle integration stream. Last updated: {coverage.lms?.lastUpdated || 'Recent'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Weekly Logins</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.lms.weeklyLogins}</div>
                <div className="text-xs text-slate-500 mt-0.5">Sessions logged per week</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Assignment Completion</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.lms.assignmentCompletionRate}%</div>
                <div className="text-xs text-slate-500 mt-0.5">Submission on-time rate</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Avg Session Study</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {student.lms.avgTimeSpentHoursWeekly} hrs/wk
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Active portal study hours</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Overdue Assignments</span>
                <div className={`text-2xl font-black mt-1 ${
                  student.lms.overdueAssignments > 0 ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {student.lms.overdueAssignments}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Pending homework modules</div>
              </div>
            </div>
          </div>
        )}

        {/* 4. Placement Tab */}
        {activeTab === 'PLACEMENT' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-rose-600" />
                Placement &amp; Industry Readiness
              </h3>
              <p className="text-xs text-slate-500">
                Coding tests, aptitude scores, and mock interview assessments. Last updated: {coverage.placement?.lastUpdated || 'Recent'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Coding Benchmark</span>
                <div className={`text-2xl font-black mt-1 ${
                  student.placement.codingScore >= 70 ? 'text-emerald-700' : student.placement.codingScore < 50 ? 'text-rose-600' : 'text-amber-700'
                }`}>
                  {student.placement.codingScore}/100
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Solved: {student.placement.solvedProblemsCount} problems</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Aptitude Score</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.placement.aptitudeScore}/100</div>
                <div className="text-xs text-slate-500 mt-0.5">Quantitative &amp; logical reasoning</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Mock Interview</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.placement.mockInterviewRating}/100</div>
                <div className="text-xs text-slate-500 mt-0.5">Technical &amp; behavioral rating</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Campus Drive Status</span>
                <div className="text-xl font-black text-slate-900 mt-1">
                  {student.placement.placementDriveEligible ? 'Eligible' : 'Hold'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Tier-1 Company eligibility</div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Skills Tab */}
        {activeTab === 'SKILLS' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Award className="w-5 h-5 text-rose-600" />
                Verified Skills &amp; Competencies
              </h3>
              <p className="text-xs text-slate-500">
                Technical assessments and soft skill metrics. Last updated: {coverage.skills?.lastUpdated || 'Recent'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Technical Rating</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.skills.technicalRating}/100</div>
                <div className="text-xs text-slate-500 mt-0.5">Primary discipline competency index</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Communication Rating</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.skills.softSkillsRating}/100</div>
                <div className="text-xs text-slate-500 mt-0.5">Verbal, presentation &amp; team skills</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Primary Verified Skillsets:</div>
              <div className="flex flex-wrap gap-2">
                {student.skills.primarySkillset.map((skill, i) => (
                  <span key={i} className="px-3 py-1 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 6. Engagement Tab */}
        {activeTab === 'ENGAGEMENT' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-600" />
                Extracurricular, Hackathons &amp; Campus Life
              </h3>
              <p className="text-xs text-slate-500">
                Co-curricular verified participation. Last updated: {coverage.engagement?.lastUpdated || 'Recent'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Hackathons</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.engagement.hackathonsCount}</div>
                <div className="text-xs text-slate-500 mt-0.5">Wins: {student.engagement.hackathonWins}</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Events / Workshops</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.engagement.eventsAttended}</div>
                <div className="text-xs text-slate-500 mt-0.5">Conferences &amp; seminars</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Certifications</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.engagement.certifications.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">External industry certs</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Active Clubs</span>
                <div className="text-2xl font-black text-slate-900 mt-1">{student.engagement.activeClubs.length}</div>
                <div className="text-xs text-slate-500 mt-0.5">Campus organizations</div>
              </div>
            </div>
          </div>
        )}

        {/* 7. Feedback Tab */}
        {activeTab === 'FEEDBACK' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-rose-600" />
                Faculty Mentorship &amp; Qualitative Notes
              </h3>
              <p className="text-xs text-slate-500">
                Counselor feedback and student surveys. Last updated: {coverage.feedback?.lastUpdated || 'Recent'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Faculty Rating</span>
                <div className="text-2xl font-black text-slate-900 mt-1">
                  {student.feedback.studentSatisfactionScore * 20}/100
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Faculty satisfaction index</div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold text-slate-500 uppercase">Last Mentor Meeting</span>
                <div className="text-xl font-bold text-slate-900 mt-1">{student.feedback.lastMeetingDate}</div>
                <div className="text-xs text-slate-500 mt-0.5">Sentiment: {student.feedback.facultySentiment}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="text-xs font-bold text-slate-700 uppercase">Faculty Mentor Qualitative Remarks:</div>
              <p className="text-sm text-slate-800 leading-relaxed italic bg-white p-4 rounded-lg border border-slate-200">
                &ldquo;{student.feedback.facultyMentorFeedback}&rdquo;
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
