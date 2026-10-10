'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import {
  Users,
  Search,
  Filter,
  GraduationCap,
  Percent,
  Layers,
  Database,
  ArrowUpDown,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

export default function StudentsDirectoryPage() {
  const { students, uploadHistory } = useApp();

  // Search & Filters state
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedSem, setSelectedSem] = useState('ALL');
  const [selectedAttendanceBand, setSelectedAttendanceBand] = useState('ALL');
  const [selectedCgpaBand, setSelectedCgpaBand] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'usn' | 'cgpa' | 'attendance' | 'coding'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Departments list
  const departments = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.academic.department));
    return Array.from(set).sort();
  }, [students]);

  // Repository-level metrics
  const totalStudents = students.length;
  const totalDepts = departments.length;

  const studentsWithCgpa = students.filter((s) => s.academic.cgpa !== undefined && s.academic.cgpa > 0);
  const avgCgpa =
    studentsWithCgpa.length > 0
      ? (studentsWithCgpa.reduce((acc, s) => acc + s.academic.cgpa, 0) / studentsWithCgpa.length).toFixed(2)
      : '—';

  const studentsWithAtt = students.filter(
    (s) => s.attendance.overallPercentage !== undefined && s.attendance.overallPercentage > 0
  );
  const avgAttendance =
    studentsWithAtt.length > 0
      ? (studentsWithAtt.reduce((acc, s) => acc + s.attendance.overallPercentage, 0) / studentsWithAtt.length).toFixed(1)
      : '—';

  const totalDatasetsUploaded = uploadHistory.length;

  // Filtering logic
  const filteredStudents = useMemo(() => {
    return students.filter((stu) => {
      // Search
      const q = search.toLowerCase().trim();
      if (q) {
        const matchesName = stu.name.toLowerCase().includes(q);
        const matchesUsn = stu.usn.toLowerCase().includes(q);
        const matchesDept = stu.academic.department.toLowerCase().includes(q);
        const matchesSem = String(stu.academic.semester) === q;
        if (!matchesName && !matchesUsn && !matchesDept && !matchesSem) return false;
      }

      // Department
      if (selectedDept !== 'ALL' && stu.academic.department !== selectedDept) {
        return false;
      }

      // Semester
      if (selectedSem !== 'ALL' && String(stu.academic.semester) !== selectedSem) {
        return false;
      }

      // Attendance Band: Below 75, 75-85, Above 85 (75 and 85 belong to middle band per spec)
      if (selectedAttendanceBand !== 'ALL') {
        const att = stu.attendance.overallPercentage;
        if (selectedAttendanceBand === 'BELOW_75' && att >= 75) return false;
        if (selectedAttendanceBand === '75_TO_85' && (att < 75 || att > 85)) return false;
        if (selectedAttendanceBand === 'ABOVE_85' && att <= 85) return false;
      }

      // CGPA Band: Below 6, 6-8, Above 8 (6 and 8 belong to middle band per spec)
      if (selectedCgpaBand !== 'ALL') {
        const gpa = stu.academic.cgpa;
        if (selectedCgpaBand === 'BELOW_6' && gpa >= 6.0) return false;
        if (selectedCgpaBand === '6_TO_8' && (gpa < 6.0 || gpa > 8.0)) return false;
        if (selectedCgpaBand === 'ABOVE_8' && gpa <= 8.0) return false;
      }

      return true;
    });
  }, [students, search, selectedDept, selectedSem, selectedAttendanceBand, selectedCgpaBand]);

  // Sorting
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      let valA: any = a.name;
      let valB: any = b.name;

      if (sortBy === 'usn') {
        valA = a.usn;
        valB = b.usn;
      } else if (sortBy === 'cgpa') {
        valA = a.academic.cgpa;
        valB = b.academic.cgpa;
      } else if (sortBy === 'attendance') {
        valA = a.attendance.overallPercentage;
        valB = b.attendance.overallPercentage;
      } else if (sortBy === 'coding') {
        valA = a.placement.codingScore;
        valB = b.placement.codingScore;
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredStudents, sortBy, sortOrder]);

  const totalPages = Math.ceil(sortedStudents.length / pageSize) || 1;
  const pagedStudents = sortedStudents.slice((page - 1) * pageSize, page * pageSize);

  const toggleSort = (col: typeof sortBy) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('asc');
    }
  };

  const clearAllFilters = () => {
    setSearch('');
    setSelectedDept('ALL');
    setSelectedSem('ALL');
    setSelectedAttendanceBand('ALL');
    setSelectedCgpaBand('ALL');
    setPage(1);
  };

  const hasActiveFilters =
    search !== '' ||
    selectedDept !== 'ALL' ||
    selectedSem !== 'ALL' ||
    selectedAttendanceBand !== 'ALL' ||
    selectedCgpaBand !== 'ALL';

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto">
      {/* Header banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-300 bg-gradient-to-br from-white/95 via-rose-50/30 to-pink-50/20 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 text-[11px] font-bold font-mono tracking-wider rounded-full bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-rose-600" />
              UNIFIED STUDENT REPOSITORY
            </span>
            <span className="text-xs text-slate-500 font-semibold">• Keyed by Student ID</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Institutional Student Directory &amp; Data Coverage
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
            Consolidated directory of all enrolled students with integrated cross-pillar metrics. Click any
            student to inspect their complete 360° profile with source freshness and missing data tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/data-upload"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Upload New Dataset</span>
            <ChevronRight className="w-3.5 h-3.5 text-rose-200" />
          </Link>
        </div>
      </div>

      {/* Repository-Level Metric Cards (Page 6 PDF spec) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Students</span>
            <Users className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalStudents}</div>
          <div className="text-[11px] text-slate-500 mt-1">Unique master student entities</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Departments</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalDepts}</div>
          <div className="text-[11px] text-slate-500 mt-1">Distinct academic branches</div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Average CGPA</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{avgCgpa}</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {studentsWithCgpa.length} students with valid CGPA
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Attendance</span>
            <Percent className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{avgAttendance}%</div>
          <div className="text-[11px] text-slate-500 mt-1">
            Across {studentsWithAtt.length} students with records
          </div>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-300 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Datasets Uploaded</span>
            <Clock className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900">{totalDatasetsUploaded}</div>
          <div className="text-[11px] text-rose-600 font-semibold mt-1">
            <Link href="/admin/data-upload" className="hover:underline">
              View upload history →
            </Link>
          </div>
        </div>
      </div>

      {/* Search & Multi-Filters Toolbar */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-300 bg-white shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Student Name, USN / ID, Department, or Semester..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Department dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>

            {/* Semester dropdown */}
            <select
              value={selectedSem}
              onChange={(e) => {
                setSelectedSem(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={String(sem)}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Pills for Attendance and CGPA Bands */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-bold flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Attendance Band:
            </span>
            <button
              onClick={() => { setSelectedAttendanceBand('ALL'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedAttendanceBand === 'ALL'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setSelectedAttendanceBand('BELOW_75'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedAttendanceBand === 'BELOW_75'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              &lt; 75% (Critical)
            </button>
            <button
              onClick={() => { setSelectedAttendanceBand('75_TO_85'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedAttendanceBand === '75_TO_85'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
              }`}
            >
              75% – 85%
            </button>
            <button
              onClick={() => { setSelectedAttendanceBand('ABOVE_85'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedAttendanceBand === 'ABOVE_85'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              &gt; 85% (Optimal)
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-500 font-bold">CGPA Band:</span>
            <button
              onClick={() => { setSelectedCgpaBand('ALL'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCgpaBand === 'ALL'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All
            </button>
            <button
              onClick={() => { setSelectedCgpaBand('BELOW_6'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCgpaBand === 'BELOW_6'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200'
              }`}
            >
              &lt; 6.0
            </button>
            <button
              onClick={() => { setSelectedCgpaBand('6_TO_8'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCgpaBand === '6_TO_8'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200'
              }`}
            >
              6.0 – 8.0
            </button>
            <button
              onClick={() => { setSelectedCgpaBand('ABOVE_8'); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                selectedCgpaBand === 'ABOVE_8'
                  ? 'bg-rose-600 text-white shadow-2xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}
            >
              &gt; 8.0 (Honor)
            </button>
          </div>
        </div>

        {/* Active Filter Chips & Clear */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500 font-semibold">Active Filters:</span>
              {search && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1 font-mono">
                  query: {search}
                  <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedDept !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                  dept: {selectedDept}
                  <button onClick={() => setSelectedDept('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedSem !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                  sem: {selectedSem}
                  <button onClick={() => setSelectedSem('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedAttendanceBand !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                  attendance: {selectedAttendanceBand}
                  <button onClick={() => setSelectedAttendanceBand('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
              {selectedCgpaBand !== 'ALL' && (
                <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 flex items-center gap-1">
                  cgpa: {selectedCgpaBand}
                  <button onClick={() => setSelectedCgpaBand('ALL')}><X className="w-3 h-3" /></button>
                </span>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="text-rose-600 hover:text-rose-700 font-bold underline text-xs"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>

      {/* Student Directory Table (Page 6 PDF spec) */}
      <div className="glass-panel rounded-2xl border border-slate-300 overflow-hidden bg-white shadow-sm space-y-3 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              Integrated Student Master Directory
            </h2>
            <p className="text-xs text-slate-500">
              Showing {sortedStudents.length} of {students.length} student records. Values reflect the latest valid integrated records.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-xl">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th
                  onClick={() => toggleSort('usn')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student ID</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none"
                >
                  <div className="flex items-center gap-1.5">
                    <span>Student Name</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4 text-center">Semester</th>
                <th
                  onClick={() => toggleSort('cgpa')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>CGPA</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('attendance')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Attendance %</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('coding')}
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition select-none text-right"
                >
                  <div className="flex items-center justify-end gap-1.5">
                    <span>Coding Score</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Data Completeness</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {pagedStudents.map((stu) => {
                const completeness = stu.dataCompleteness || 'Complete';
                const att = stu.attendance.overallPercentage;

                return (
                  <tr key={stu.id} className="hover:bg-slate-50/70 transition">
                    {/* Student ID */}
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      <Link
                        href={`/students/${stu.id}`}
                        className="text-rose-600 hover:text-rose-700 underline flex items-center gap-1"
                      >
                        {stu.usn}
                      </Link>
                    </td>

                    {/* Student Name */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={stu.avatarUrl}
                          alt={stu.name}
                          className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                        />
                        <span>{stu.name}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                        {stu.academic.department}
                      </span>
                    </td>

                    {/* Semester */}
                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                      Sem {stu.academic.semester}
                    </td>

                    {/* CGPA */}
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      {stu.academic.cgpa ? (
                        <span className={stu.academic.cgpa >= 8 ? 'text-emerald-700' : stu.academic.cgpa < 6 ? 'text-rose-600' : 'text-slate-800'}>
                          {stu.academic.cgpa.toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Attendance % */}
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-md font-mono font-bold text-[11px] ${
                          att >= 85
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : att < 75
                            ? 'bg-rose-50 text-rose-800 border border-rose-200'
                            : 'bg-amber-50 text-amber-800 border border-amber-200'
                        }`}
                      >
                        {att.toFixed(1)}%
                      </span>
                    </td>

                    {/* Coding Score */}
                    <td className="py-3 px-4 text-right font-mono">
                      {stu.placement.codingScore !== undefined && stu.placement.codingScore > 0 ? (
                        <span className="font-semibold text-slate-800">{stu.placement.codingScore}/100</span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    {/* Completeness Status (Page 6 PDF: Complete / Partial / Missing data, not risk) */}
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          completeness === 'Complete'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : completeness === 'Partial'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : 'bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {completeness}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <Link
                        href={`/students/${stu.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-300 hover:border-rose-300 font-bold text-xs transition shadow-2xs"
                      >
                        <span>Inspect</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {pagedStudents.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    No student records matched the specified search and filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination bar */}
        <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
          <div>
            Showing page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              Previous
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
