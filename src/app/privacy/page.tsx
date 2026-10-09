'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          Document ID: RVCE-DPO-POL-2026-V1
        </div>
      </div>

      {/* Document Header Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-300 bg-white shadow-sm space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Official Institutional Policy • Active AY 2026-27
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Institutional Data Privacy &amp; Governance Policy
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Office of the Registrar &amp; Proctorial Board, RV College of Engineering, Bengaluru. This policy governs all data ingestion, explainable AI inference, access control, and records management within <strong>Campus Pulse AI</strong> (custom domain: <span className="font-mono text-rose-700 font-bold">pulse.rvce.edu.in</span>).
        </p>
      </div>

      {/* Policy Sections */}
      <div className="space-y-4">
        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">1</span>
            Statutory Governance &amp; Regulatory Compliance
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Campus Pulse AI operates strictly in conformance with the <strong>Digital Personal Data Protection (DPDP) Act 2023 (India)</strong>, the <strong>University Grants Commission (UGC) Guidelines for Digital Academic Record Maintenance</strong>, and the institutional privacy benchmarks established under the <strong>Family Educational Rights and Privacy Act (FERPA)</strong>. All student records constitute protected academic telemetry and are governed under strict fiduciary care.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">2</span>
            Unified 7-Pillar Data Ingestion Scope
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            The platform aggregates data solely from authorized university intranet systems across 7 defined data streams:
          </p>
          <ul className="text-xs text-slate-700 space-y-1.5 list-disc pl-5">
            <li><strong>Pillar 1 (Academic Registrar):</strong> Cumulative GPA, semester trends, active/cleared backlogs, Continuous Internal Evaluation (CIE) scores.</li>
            <li><strong>Pillar 2 (Classroom Attendance):</strong> RFID reader logs, subject-wise attendance percentages, authorized medical condonations.</li>
            <li><strong>Pillar 3 (LMS Digital Velocity):</strong> LMS logins, assignment submission timeliness, learning resource access frequency.</li>
            <li><strong>Pillar 4 (Placement Readiness):</strong> Coding test benchmarks, algorithmic problem counts, mock interview evaluation scores.</li>
            <li><strong>Pillar 5 (Campus Life &amp; Sports):</strong> Extracurricular hours, athletic conditioning schedules, hackathon participation records.</li>
            <li><strong>Pillar 6 (Skills Matrix):</strong> Verified technical indices, communication assessments, and competency mastery ratings.</li>
            <li><strong>Pillar 7 (Faculty Feedback &amp; Sentiment):</strong> Proctorial board observations, formal mentor meeting notes, and academic guidance directives.</li>
          </ul>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">3</span>
            Explainable AI (XAI) &amp; Algorithmic Transparency
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Campus Pulse AI adheres to strict <strong>Explainable AI (XAI)</strong> standards. No opaque black-box machine learning models are used for risk scoring or academic standing assessments. Every composite Success Score is generated through explicit, auditable weights. Students possess the statutory right to view all positive drivers and negative drag factors directly via the &ldquo;Why This Score?&rdquo; diagnostic panel and to file a formal appeal with Dean Dr. Sharma in case of factual discrepancy.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">4</span>
            Role-Based Access Control (RBAC) &amp; Security Architecture
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Access is strictly compartmentalized: Students can only inspect their personal educational records. Faculty Proctors and Department Deans access authorized student rosters via verified 2FA institutional credentials. All data in transit is encrypted using <strong>TLS 1.3</strong> under the university intranet certificate (<span className="font-mono text-slate-900 font-bold">pulse.rvce.edu.in</span>), and data at rest is encrypted with <strong>AES-256</strong>. Sessions automatically terminate after 15 minutes of idle inactivity.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-300 bg-white shadow-xs">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-mono font-bold">5</span>
            Data Retention, Deletion &amp; Institutional Contacts
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Academic logs are maintained for the duration of the student&apos;s degree program plus 3 years of post-graduation audit compliance. Medical slips submitted for condonation are permanently expunged following the completion of university convocation. For inquiries, contact the Data Protection Officer: <strong>dpo@rvce.edu.in</strong>, Office of Academic Affairs, RVCE, Mysore Road, Bengaluru - 560059.
          </p>
        </div>
      </div>

      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white font-bold text-xs shadow-md hover:from-red-500 hover:to-pink-500 transition"
        >
          Acknowledge &amp; Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
