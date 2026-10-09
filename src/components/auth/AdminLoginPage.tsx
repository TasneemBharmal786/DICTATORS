'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  ShieldAlert,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  Building2,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';

export const AdminLoginPage: React.FC<{ onSwitchToStudent: () => void }> = ({ onSwitchToStudent }) => {
  const { setRole, setIsLoggedOut } = useApp();
  const [email, setEmail] = useState('dean.academics@rvce.edu.in');
  const [password, setPassword] = useState('admin123');
  const [errorMessage, setErrorMessage] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== 'dean.academics@rvce.edu.in' || password !== 'admin123') {
      setErrorMessage('Invalid administrative credentials. Access Denied.');
      return;
    }

    setErrorMessage('');
    setRole('ADMIN');
    setIsLoggedOut(false);
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 animate-fadeIn">
      {/* Institutional Security Header */}
      <div className="text-center mb-8">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-rose-600 via-red-600 to-slate-800 p-0.5 mx-auto mb-3 shadow-xl shadow-slate-950 flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center text-rose-500">
            <ShieldAlert className="w-8 h-8" />
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-bold uppercase tracking-wider mb-2">
          <span>Restricted Access</span> • <span>Faculty &amp; Administration Only</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Faculty &amp; Dean Console
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Office of Academic Affairs • Institutional Intelligence &amp; Onboarding Gatekeeper
        </p>
      </div>

      {/* Admin Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-rose-500/30 bg-slate-900/95 shadow-2xl relative overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 absolute top-0 left-0" />

        {/* Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Dean Credential Badge */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-pink-600 flex items-center justify-center font-bold text-white text-base shadow">
            DS
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Dr. Sharma</h4>
            <p className="text-[11px] text-rose-400 font-medium">Dean of Academic Affairs &amp; Institutional Auditor</p>
            <p className="text-[10px] text-slate-500 font-mono">RV College of Engineering</p>
          </div>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Institutional Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Administrative Security Passcode
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 py-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> 2FA Clearance Active
            </span>
            <span className="font-mono text-slate-500">Security: Tier-1 Admin</span>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2"
          >
            <span>Authorize &amp; Enter Faculty Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onSwitchToStudent}
              className="text-xs text-slate-400 hover:text-white transition flex items-center justify-center gap-1 mx-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Student Sign In Portal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
