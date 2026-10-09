'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { StudentDashboard } from '@/components/student/StudentDashboard';
import { LoginPage } from '@/components/auth/LoginPage';
import { AdminLoginPage } from '@/components/auth/AdminLoginPage';

export default function HomePage() {
  const { role, isLoggedOut } = useApp();
  const [authView, setAuthView] = useState<'STUDENT' | 'ADMIN'>('STUDENT');

  if (isLoggedOut) {
    if (authView === 'ADMIN') {
      return <AdminLoginPage onSwitchToStudent={() => setAuthView('STUDENT')} />;
    }
    return <LoginPage onSwitchToAdmin={() => setAuthView('ADMIN')} />;
  }

  return (
    <div>
      {role === 'ADMIN' ? <AdminDashboard /> : <StudentDashboard />}
    </div>
  );
}
