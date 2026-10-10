'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import {
  GraduationCap,
  ShieldAlert,
  Bell,
  ChevronDown,
  Sparkles,
  School,
  User,
  LogOut,
  Database,
  Users,
  UploadCloud,
  LayoutDashboard,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { role, currentStudent, students, setActiveStudentId, activeStudentId, setIsLoggedOut } = useApp();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-slate-300 bg-white/85 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-pink-500 p-0.5 shadow-md shadow-rose-500/25 flex items-center justify-center group-hover:scale-105 transition">
            <div className="h-full w-full bg-white rounded-[10px] flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-rose-600" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
                CAMPUS PULSE AI
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                pulse.rvce.edu.in
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-semibold">
              Institutional Intelligence &amp; Student Success Platform
            </p>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-300 text-xs font-bold">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              pathname === '/'
                ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/students"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
              pathname?.startsWith('/students')
                ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Student Repository</span>
          </Link>

          {role === 'ADMIN' && (
            <Link
              href="/admin/data-upload"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                pathname === '/admin/data-upload'
                  ? 'bg-white text-rose-700 shadow-2xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5 text-rose-600" />
              <span>Data Ingestion</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] bg-rose-100 text-rose-800 font-mono font-black">
                P2
              </span>
            </Link>
          )}
        </nav>

        {/* Right: User Profile & Quick Switcher */}
        <div className="flex items-center gap-3">
          {role === 'STUDENT' ? (
            <div className="flex items-center gap-2 bg-white/90 p-1.5 pr-3 rounded-xl border border-slate-300 shadow-xs">
              <img
                src={currentStudent?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentStudent?.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-rose-500/40"
              />
              <div className="text-left text-xs">
                <div className="font-bold text-slate-900 leading-tight">
                  {currentStudent?.name}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  {currentStudent?.usn}
                </div>
              </div>

              {/* Student selector dropdown for demo convenience */}
              <div className="relative ml-2">
                <select
                  value={activeStudentId}
                  onChange={(e) => setActiveStudentId(e.target.value)}
                  className="bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-lg px-2 py-1 focus:ring-1 focus:ring-rose-500 outline-none cursor-pointer"
                >
                  {students.map((stu) => (
                    <option key={stu.id} value={stu.id}>
                      {stu.name} ({stu.approvalStatus})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-white/90 py-1.5 px-3 rounded-xl border border-slate-300 shadow-xs">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-red-600 to-pink-600 flex items-center justify-center text-white text-xs font-bold">
                  DS
                </div>
                <div className="text-left text-xs">
                  <div className="font-bold text-slate-900">Dr. Sharma</div>
                  <div className="text-[10px] text-rose-600 font-semibold">Dean of Academic Affairs</div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Log Out / Switch Auth Button */}
          <button
            onClick={() => setIsLoggedOut(true)}
            title="Log Out & Open Login Page"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 text-xs font-bold transition-colors shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};
