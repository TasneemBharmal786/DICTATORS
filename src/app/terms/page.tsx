'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Banner Navigation */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-300">
        <Link
          href="/"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:text-rose-600 hover:border-rose-300 transition shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Dashboard</span>
        </Link>
        <div className="text-[11px] font-mono text-slate-500 font-semibold">
          Code: RVCE-REG-TOS-2026-V1
        </div>
      </div>

      {/* Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-rose-50 text-rose-800 border border-rose-300 font-mono text-[10px] font-bold">
          <FileText className="w-3.5 h-3.5 text-rose-600" />
          Acceptable Use Policy &amp; Terms of Service
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms and Conditions of University Intranet Access
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          By accessing Campus Pulse AI at <span className="font-mono text-rose-700 font-bold">pulse.rvce.edu.in</span>, all enrolled students, proctors, and faculty members agree to abide by the statutory guidelines outlined below.
        </p>
      </div>

      {/* Terms Sections */}
      <div className="space-y-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">1</span>
            Authorized User Eligibility &amp; Gated Authentication
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Access is strictly restricted to bona fide students with valid University Seat Numbers (USN) and certified academic staff of RV College of Engineering. Newly registered student profiles undergo mandatory review by the Faculty Dean Gatekeeper prior to activation. Any attempt to fabricate USN identifiers or bypass the onboarding gatekeeper triggers disciplinary proceedings under the RVCE Academic Disciplinary Code.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">2</span>
            Academic Integrity &amp; Anti-Tampering Provisions
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Students and proctors agree that all continuous assessments, lab submissions, attendance check-ins, and coding evaluations represent authentic coursework. Tampering with RFID card telemetry, automating mock interview responses, or submitting plagiarized code will result in immediate cancellation of placement drive eligibility and debarment from Semester End Examinations.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">3</span>
            Autonomous AI Mentor (&ldquo;Aditi&rdquo;) Operational Scope
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Aditi is programmed as an institutional academic, placement, and athletic scheduling advisor. Aditi is under strict statutory duty to respond solely to questions regarding university policies, academic subjects, exam preparation, and holistic study schedules. Mentorship suggestions provided by Aditi are advisory; statutory decisions regarding examination hall ticket release, condonations, and degree conferral remain solely with the Dean of Academic Affairs and the RVCE Academic Senate.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">4</span>
            Session Security, Idle Timeouts &amp; Credential Protection
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Users are solely responsible for maintaining the confidentiality of their portal credentials. To safeguard student records against unauthorized third-party inspection in public computer laboratories, sessions automatically expire after 15 minutes of uninterrupted inactivity. Simultaneous logins across disparate IP addresses are automatically blocked by the institutional firewall.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">5</span>
            Governing Law &amp; Institutional Jurisdiction
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            These terms and conditions are governed by and construed in accordance with the laws of the Republic of India and the university statutes of Visvesvaraya Technological University (VTU) / RVCE Autonomous Regulations. Any legal matters arising from system use are subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-md hover:from-red-500 hover:to-pink-500 transition"
        >
          Accept Terms &amp; Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
