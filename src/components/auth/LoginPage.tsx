'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  ArrowRight,
  User,
  KeyRound,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';

export const LoginPage: React.FC<{ onSwitchToAdmin: () => void }> = ({ onSwitchToAdmin }) => {
  const { setRole, setActiveStudentId, setIsLoggedOut, students } = useApp();

  const [studentUsn, setStudentUsn] = useState('');
  const [studentPwd, setStudentPwd] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUsn = studentUsn.trim().toUpperCase();
    const found = students.find((s) => s.usn.toUpperCase() === cleanUsn);

    if (!found) {
      setErrorMessage(`No student record found with USN "${cleanUsn}". Please check your USN or register.`);
      return;
    }

    setErrorMessage('');
    setActiveStudentId(found.id);
    setRole('STUDENT');
    setIsLoggedOut(false);
  };

  const autofill = (usnVal: string) => {
    setStudentUsn(usnVal);
    setStudentPwd('password123');
    setErrorMessage('');
  };

  return (
    <div className="max-w-md mx-auto py-8 sm:py-12 px-4 animate-fadeIn">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 p-0.5 mx-auto mb-3 shadow-xl shadow-indigo-500/20 flex items-center justify-center">
          <div className="h-full w-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <GraduationCap className="w-7 h-7 text-indigo-400" />
          </div>
        </div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Student Portal Sign In
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Enter your student credentials to view your Success Score, Risk Flags, and AI recommendations.
        </p>
      </div>

      {/* Auth Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-slate-900/90 shadow-2xl">
        {/* Error Message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleStudentLogin} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              University Seat Number (USN)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter USN (e.g. 1RV22CS102)"
                value={studentUsn}
                onChange={(e) => setStudentUsn(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-mono uppercase focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1.5">
              Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={studentPwd}
                onChange={(e) => setStudentPwd(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <span>Sign In to Student Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Separate Admin Portal Link */}
          <div className="pt-3 flex items-center justify-between text-[11px] border-t border-slate-800">
            <span className="text-slate-500">Faculty or Dean Staff?</span>
            <button
              type="button"
              onClick={onSwitchToAdmin}
              className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Go to Faculty Admin Portal →</span>
            </button>
          </div>

          {/* Quick Demo Autofill Presets */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400">
            <span className="font-semibold text-slate-300 block mb-2">
              Demo Archetypes (Click to Auto-fill):
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => autofill('1RV21IT045')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-emerald-500/30 text-emerald-300 font-mono text-[10px]"
              >
                <strong>Priya Nair</strong> (Score 95)<br /><span className="text-slate-400 font-sans">Top Performer (Approved)</span>
              </button>
              <button
                type="button"
                onClick={() => autofill('1RV22CS102')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-indigo-500/30 text-indigo-300 font-mono text-[10px]"
              >
                <strong>Rahul Verma</strong> (Score 73)<br /><span className="text-slate-400 font-sans">All-Rounder (Approved)</span>
              </button>
              <button
                type="button"
                onClick={() => autofill('1RV22EC088')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-rose-500/30 text-rose-300 font-mono text-[10px]"
              >
                <strong>Sneha Rao</strong> (Score 44)<br /><span className="text-slate-400 font-sans">Academic Risk (58% Att)</span>
              </button>
              <button
                type="button"
                onClick={() => autofill('1RV21CS034')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-300 font-mono text-[10px]"
              >
                <strong>Arjun Mehta</strong> (Score 62)<br /><span className="text-slate-400 font-sans">Placement Risk (42 Code)</span>
              </button>
              <button
                type="button"
                onClick={() => autofill('1RV21AI019')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-cyan-500/30 text-cyan-300 font-mono text-[10px]"
              >
                <strong>Karan Patel</strong> (Score 78)<br /><span className="text-slate-400 font-sans">Coding Wizard (96 Code)</span>
              </button>
              <button
                type="button"
                onClick={() => autofill('1RV22IS076')}
                className="p-2 text-left rounded-lg bg-slate-800 hover:bg-slate-700 border border-pink-500/30 text-pink-300 font-mono text-[10px]"
              >
                <strong>Rohan Joshi</strong> (Score 59)<br /><span className="text-slate-400 font-sans">LMS Deficit (56 Code)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
