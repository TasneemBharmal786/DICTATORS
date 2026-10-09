'use client';

import React from 'react';
import { PendingApprovalsWidget } from './PendingApprovalsWidget';
import { MacroAnalytics } from './MacroAnalytics';
import { StudentTable } from './StudentTable';
import { StudentDetailModal } from './StudentDetailModal';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 animate-fadeIn">
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
