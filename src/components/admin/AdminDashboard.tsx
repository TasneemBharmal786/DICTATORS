'use client';

import React from 'react';
import Link from 'next/link';
import { PendingApprovalsWidget } from './PendingApprovalsWidget';
import { MacroAnalytics } from './MacroAnalytics';
import { StudentTable } from './StudentTable';
import { StudentDetailModal } from './StudentDetailModal';
import { Database, FileSpreadsheet, Users, ChevronRight, Sparkles } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export const AdminDashboard: React.FC = () => {
  const { students, uploadHistory } = useApp();

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Phase 2 Data Integration Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white border border-rose-900/40 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
              PHASE 2 READY
            </span>
            <span className="text-xs font-bold text-rose-200">Data Integration &amp; Unified Repository</span>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Ingest and validate CSV/XLSX records across 7 institutional pillars, inspect row errors, and explore
            the unified student repository.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/data-upload"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-xs transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Upload Dataset (P2)</span>
            <ChevronRight className="w-3 h-3 text-rose-200" />
          </Link>
          <Link
            href="/students"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs transition"
          >
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span>Repository Directory ({students.length})</span>
          </Link>
        </div>
      </div>

      {/* 1. Gated Onboarding / Pending Approvals Banner (Priority 1) */}
      <PendingApprovalsWidget />

      {/* 2. Macro Analytics View (Campus KPIs & Cohorts) */}
      <MacroAnalytics />

      {/* 3. Micro Student Roster (Deep clickable profiles) */}
      <StudentTable />

      {/* 4. Student Detail 360° Profile Modal */}
      <StudentDetailModal />
    </div>
  );
};
