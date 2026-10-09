'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import {
  TrendingUp,
  AlertTriangle,
  Briefcase,
  Users,
  Search,
  Filter,
  CheckCircle,
  GraduationCap,
} from 'lucide-react';

export const MacroAnalytics: React.FC = () => {
  const {
    students,
    searchQuery,
    setSearchQuery,
    selectedCohortFilter,
    setSelectedCohortFilter,
    selectedRiskFilter,
    setSelectedRiskFilter,
  } = useApp();

  // Computations
  const totalStudents = students.length;
  const avgSuccessScore = Math.round(
    students.reduce((acc, s) => acc + s.successScore.overall, 0) / (totalStudents || 1)
  );

  const highAcademicRiskCount = students.filter(
    (s) => s.risk.academicRisk === 'HIGH'
  ).length;

  const highPlacementRiskCount = students.filter(
    (s) => s.risk.placementRisk === 'HIGH'
  ).length;

  const topPerformersCount = students.filter(
    (s) => s.cohort.type === 'TOP_PERFORMER'
  ).length;

  const cohorts = [
    { key: 'ALL', label: 'All Cohorts', count: totalStudents },
    {
      key: 'TOP_PERFORMER',
      label: 'Campus Stars / Top Performers',
      count: students.filter((s) => s.cohort.type === 'TOP_PERFORMER').length,
      badge: 'border-emerald-500/30 text-emerald-300',
    },
    {
      key: 'HIGH_ACADEMIC_LOW_PLACEMENT',
      label: 'High Academic, Low Placement',
      count: students.filter((s) => s.cohort.type === 'HIGH_ACADEMIC_LOW_PLACEMENT').length,
      badge: 'border-amber-500/30 text-amber-300',
    },
    {
      key: 'PRACTICAL_INNOVATOR',
      label: 'Coding Wizards / Practical Innovators',
      count: students.filter((s) => s.cohort.type === 'PRACTICAL_INNOVATOR').length,
      badge: 'border-indigo-500/30 text-indigo-300',
    },
    {
      key: 'DROPOUT_RISK',
      label: 'High Risk of Dropout / Year-Back',
      count: students.filter((s) => s.cohort.type === 'DROPOUT_RISK').length,
      badge: 'border-rose-500/30 text-rose-300',
    },
    {
      key: 'DISENGAGED_LMS',
      label: 'Disengaged LMS / Passive Learners',
      count: students.filter((s) => s.cohort.type === 'DISENGAGED_LMS').length,
      badge: 'border-slate-500/30 text-slate-300',
    },
  ];

  return (
    <div className="space-y-6 mb-8">
      {/* Top Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Macro Intelligence &amp; Campus Health
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Cross-departmental aggregated indicators synthesizing academic, behavioral, and placement signals.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Average Success Score */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-indigo-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Mean Campus Success Score
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {avgSuccessScore}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>↑ +4.2 points vs AY 2025</span>
          </div>
        </div>

        {/* Card 2: Academic At-Risk Flags */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-rose-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High Academic Risk
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-rose-400 tracking-tight">
              {highAcademicRiskCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Student{highAcademicRiskCount === 1 ? '' : 's'} Flagged
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-semibold">
            ↓ -1 student since mid-term (Sneha Rao: 58% Att)
          </div>
        </div>

        {/* Card 3: Placement Risk Flags */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-amber-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              High Placement Risk
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Briefcase className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-400 tracking-tight">
              {highPlacementRiskCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Student{highPlacementRiskCount === 1 ? '' : 's'} Flagged
            </span>
          </div>
          <div className="mt-3 text-[11px] text-rose-400 font-semibold">
            ↑ +2 flagged in mock cycle (Arjun Mehta, Rohan Joshi)
          </div>
        </div>

        {/* Card 4: Top Performer Stars */}
        <div className="glass-panel rounded-2xl p-4 sm:p-5 relative overflow-hidden group hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Campus Stars (Top Tier)
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">
              {topPerformersCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">Top Cohort</span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400 font-semibold">
            ↑ +1 student this semester (Priya Nair: 95/100)
          </div>
        </div>
      </div>

      {/* Cohort Segmentation Filters & Search Bar */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <Filter className="w-4 h-4 text-indigo-400" />
              Actionable Cohort Segmentation
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter by proprietary behavioural cohorts to assign targeted faculty interventions.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, USN, or dept..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700/80 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-bold"
              >
                X
              </button>
            )}
          </div>
        </div>

        {/* Cohort Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {cohorts.map((cohort) => (
            <button
              key={cohort.key}
              onClick={() => setSelectedCohortFilter(cohort.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCohortFilter === cohort.key
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 border border-indigo-500'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700/60'
              }`}
            >
              <span>{cohort.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-md font-bold ${
                  selectedCohortFilter === cohort.key
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {cohort.count}
              </span>
            </button>
          ))}
        </div>

        {/* Risk Level Filter Bar */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-medium">Filter by Overall Risk Severity:</span>
          <div className="flex items-center gap-1.5">
            {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((risk) => (
              <button
                key={risk}
                onClick={() => setSelectedRiskFilter(risk)}
                className={`px-2.5 py-1 rounded-lg font-medium text-xs transition-all ${
                  selectedRiskFilter === risk
                    ? risk === 'HIGH'
                      ? 'bg-rose-600 text-white'
                      : risk === 'MEDIUM'
                      ? 'bg-amber-600 text-white'
                      : risk === 'LOW'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {risk === 'ALL' ? 'All Risk Levels' : `${risk} Risk`}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
