'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import { Student } from '@/types/student';
import {
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Eye,
  ArrowUpRight,
  Layers,
} from 'lucide-react';

export const StudentTable: React.FC = () => {
  const {
    students,
    searchQuery,
    selectedCohortFilter,
    selectedRiskFilter,
    setSelectedMicroStudent,
  } = useApp();

  // Apply search & filters
  const filteredStudents = students.filter((student) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        student.name.toLowerCase().includes(q) ||
        student.usn.toLowerCase().includes(q) ||
        student.academic.department.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Cohort filter match
    if (selectedCohortFilter !== 'ALL') {
      if (student.cohort.type !== selectedCohortFilter) return false;
    }

    // Risk filter match
    if (selectedRiskFilter !== 'ALL') {
      if (student.risk.overallRisk !== selectedRiskFilter) return false;
    }

    return true;
  });

  return (
    <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
      <div className="p-5 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            Institutional Student Roster &amp; Unified Intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any student to open the Micro 360° Profile, Explainable AI breakdown, and faculty intervention plan.
          </p>
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing {filteredStudents.length} of {students.length} students
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 font-semibold uppercase tracking-wider">
              <th className="py-3.5 px-4">Student</th>
              <th className="py-3.5 px-4">Dept / Sem</th>
              <th className="py-3.5 px-4">Success Score</th>
              <th className="py-3.5 px-4 text-center">Academic Risk</th>
              <th className="py-3.5 px-4 text-center">Placement Risk</th>
              <th className="py-3.5 px-4">Behavioral Cohort</th>
              <th className="py-3.5 px-4 text-center">Status</th>
              <th className="py-3.5 px-4 text-right">Micro View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400">
                  <div className="max-w-sm mx-auto">
                    <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-300">No students matched the active filters.</p>
                    <p className="text-xs text-slate-500 mt-1">Try clearing the search query or selecting &quot;All Cohorts&quot;.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((student) => {
                const isHighRisk = student.risk.overallRisk === 'HIGH';

                return (
                  <tr
                    key={student.id}
                    onClick={() => setSelectedMicroStudent(student)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors group"
                  >
                    {/* Student Identity */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatarUrl}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-700 group-hover:ring-indigo-500 transition-all"
                        />
                        <div>
                          <div className="font-bold text-slate-200 group-hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                            {student.name}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400">
                            {student.usn}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department / Sem */}
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium line-clamp-1 max-w-[160px]">
                        {student.academic.department}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Semester {student.academic.semester}
                      </div>
                    </td>

                    {/* Success Score */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 text-right font-extrabold text-sm font-mono text-white">
                          {student.successScore.overall}
                        </div>
                        <div className="w-20 bg-slate-800 h-2 rounded-sm overflow-hidden">
                          <div
                            className={`h-full rounded-sm transition-all duration-500 ${
                              student.successScore.overall >= 80
                                ? 'bg-emerald-500'
                                : student.successScore.overall >= 65
                                ? 'bg-indigo-500'
                                : student.successScore.overall >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.successScore.overall}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        CGPA: {student.academic.cgpa.toFixed(2)} • Att: {student.attendance.overallPercentage}%
                      </div>
                    </td>

                    {/* Academic Risk */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          student.risk.academicRisk === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : student.risk.academicRisk === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {student.risk.academicRisk}
                      </span>
                    </td>

                    {/* Placement Risk */}
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          student.risk.placementRisk === 'HIGH'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : student.risk.placementRisk === 'MEDIUM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {student.risk.placementRisk}
                      </span>
                    </td>

                    {/* Cohort Tag */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-semibold border ${student.cohort.badgeColor}`}
                      >
                        {student.cohort.label}
                      </span>
                    </td>

                    {/* Approval Status */}
                    <td className="py-3.5 px-4 text-center">
                      {student.approvalStatus === 'APPROVED' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approved
                        </span>
                      ) : student.approvalStatus === 'PENDING' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 animate-pulse">
                          <Clock className="w-3.5 h-3.5" />
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400">
                          Rejected
                        </span>
                      )}
                    </td>

                    {/* Micro View Button */}
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedMicroStudent(student);
                        }}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-indigo-600 transition-colors inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-medium hidden sm:inline">Inspect</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
